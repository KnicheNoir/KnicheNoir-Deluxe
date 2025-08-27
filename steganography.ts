/**
 * steganography.ts
 *
 * Implements client-side steganography for embedding and extracting
 * data within images using the Least Significant Bit (LSB) method.
 * This service is designed to be cryptographically enhanced using
 * keys derived from the Astrian Engine.
 */

export class SteganographyService {
    // A unique, unlikely sequence to mark the end of the hidden message.
    private static readonly EOM_MARKER = "§ASTRIAN_EOM§";
    private static readonly EOM_MARKER_BINARY = this.stringToBinary(this.EOM_MARKER);

    /**
     * Converts a string to its binary representation (e.g., "a" -> "01100001").
     * @param str The input string.
     * @returns The binary string representation.
     */
    private static stringToBinary(str: string): string {
        return str.split('').map(char => {
            return char.charCodeAt(0).toString(2).padStart(8, '0');
        }).join('');
    }

    /**
     * Converts a binary string back to a regular string.
     * @param bin The binary string.
     * @returns The decoded string.
     */
    private static binaryToString(bin: string): string {
        const chars = bin.match(/.{1,8}/g) || [];
        return chars.map(byte => String.fromCharCode(parseInt(byte, 2))).join('');
    }

    /**
     * A simple XOR cipher for encrypting/decrypting data.
     * @param data The data to process.
     * @param key The key to use for the cipher.
     * @returns The processed data.
     */
    private static xorCipher(data: string, key: string): string {
        return data.split('').map((char, i) => {
            return String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length));
        }).join('');
    }

    /**
     * Loads an image from a base64 string onto a canvas context.
     * @param imageBase64 The base64 encoded image string.
     * @returns A promise that resolves with the canvas, context, and image element.
     */
    private static loadImageToCanvas(imageBase64: string): Promise<{ canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, img: HTMLImageElement }> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject(new Error("Could not get canvas context."));
                ctx.drawImage(img, 0, 0);
                resolve({ canvas, ctx, img });
            };
            img.onerror = reject;
            img.src = imageBase64;
        });
    }

    /**
     * Encodes a secret message into an image using LSB steganography.
     * @param imageBase64 The base64 string of the cover image.
     * @param message The message to hide.
     * @param key A secret key to encrypt the message.
     * @returns A promise that resolves with the new base64 image string containing the hidden message.
     */
    public static async encode(imageBase64: string, message: string, key: string): Promise<string> {
        const { canvas, ctx } = await this.loadImageToCanvas(imageBase64);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data; // This is a Uint8ClampedArray: [R, G, B, A, R, G, B, A, ...]

        // 1. Encrypt the message and add the End-Of-Message marker.
        const encryptedMessage = this.xorCipher(message, key);
        const binaryMessage = this.stringToBinary(encryptedMessage) + this.EOM_MARKER_BINARY;

        // 2. Check if the image is large enough to hold the message.
        // We can store 1 bit per color channel (R, G, B), so 3 bits per pixel.
        const maxBits = data.length / 4 * 3;
        if (binaryMessage.length > maxBits) {
            throw new Error(`Message is too long for this image. Max length: ${Math.floor(maxBits / 8)} bytes.`);
        }

        // 3. Embed the message bits into the image data.
        let dataIndex = 0;
        for (let i = 0; i < binaryMessage.length; i++) {
            // Find the next available color channel (skip alpha channels)
            while ((dataIndex + 1) % 4 === 0) {
                dataIndex++;
            }

            const bit = parseInt(binaryMessage[i], 10);
            
            // Modify the least significant bit of the color value
            if (bit === 1) {
                data[dataIndex] |= 1; // Set LSB to 1
            } else {
                data[dataIndex] &= ~1; // Set LSB to 0
            }
            dataIndex++;
        }

        // 4. Write the modified data back to the canvas and get the new image.
        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL();
    }

    /**
     * Decodes a secret message from an image using LSB steganography.
     * @param imageBase64 The base64 string of the steganographic image.
     * @param key The secret key to decrypt the message.
     * @returns A promise that resolves with the hidden message, or null if no message is found.
     */
    public static async decode(imageBase64: string, key: string): Promise<string | null> {
        const { canvas, ctx } = await this.loadImageToCanvas(imageBase64);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        let binaryMessage = '';
        const eomMarkerLength = this.EOM_MARKER_BINARY.length;

        for (let i = 0; i < data.length; i++) {
            // Skip alpha channels
            if ((i + 1) % 4 === 0) continue;

            // Extract the LSB
            const lsb = data[i] & 1;
            binaryMessage += lsb;

            // Check if we've found the EOM marker
            if (binaryMessage.length > eomMarkerLength && binaryMessage.endsWith(this.EOM_MARKER_BINARY)) {
                // Remove the marker from the message
                const extractedBinary = binaryMessage.slice(0, -eomMarkerLength);
                const rawMessage = this.binaryToString(extractedBinary);
                
                // Decrypt and return
                return this.xorCipher(rawMessage, key);
            }
        }

        // If we loop through the whole image and don't find the marker, there's no message.
        return null;
    }
}
