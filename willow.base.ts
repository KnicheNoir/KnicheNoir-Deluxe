
// Willow Base Encoding System
// Base-22 encoding using the 22 Hebrew letters as computational substrate

import { HEBREW_ALPHABET } from './client/src/core/gematria.ts';

function encodeUint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Willow Base-22 Encoder/Decoder
 * Uses the 22 Hebrew letters as digits for maximum compression
 */
export class WillowBase {
  private static readonly BASE = 22;
  private static readonly ALPHABET = HEBREW_ALPHABET.map(l => l.letter);
  
  // Reverse lookup: Hebrew letter -> value
  private static readonly LETTER_TO_VALUE = new Map<string, number>(
    HEBREW_ALPHABET.map((l, i) => [l.letter, i])
  );

  /**
   * Encode binary data to Willow Base-22
   */
  static encode(buffer: Uint8Array): string {
    if (buffer.length === 0) return '';
    
    // Convert buffer to big integer
    let num = BigInt(0);
    for (let i = 0; i < buffer.length; i++) {
      num = (num << BigInt(8)) | BigInt(buffer[i]);
    }
    
    // Convert to base-22 using Hebrew letters
    if (num === BigInt(0)) return this.ALPHABET[0];
    
    const result: string[] = [];
    const base = BigInt(this.BASE);
    
    while (num > BigInt(0)) {
      const remainder = Number(num % base);
      result.unshift(this.ALPHABET[remainder]);
      num = num / base;
    }
    
    return result.join('');
  }

  /**
   * Decode Willow Base-22 to binary data
   */
  static decode(encoded: string): Uint8Array {
    if (!encoded) return new Uint8Array(0);
    
    // Convert Hebrew letters to big integer
    let num = BigInt(0);
    const base = BigInt(this.BASE);
    
    for (const char of encoded) {
      const value = this.LETTER_TO_VALUE.get(char);
      if (value === undefined) {
        throw new Error(`Invalid Willow character: ${char}`);
      }
      num = num * base + BigInt(value);
    }
    
    // Convert big integer to buffer
    if (num === BigInt(0)) return new Uint8Array([0]);
    
    const bytes: number[] = [];
    while (num > BigInt(0)) {
      bytes.unshift(Number(num & BigInt(0xFF)));
      num = num >> BigInt(8);
    }
    
    return new Uint8Array(bytes);
  }

  /**
   * Encode string to Willow Base-22
   */
  static encodeString(str: string): string {
    const buffer = new TextEncoder().encode(str);
    return this.encode(buffer);
  }

  /**
   * Decode Willow Base-22 to string
   */
  static decodeString(encoded: string): string {
    const buffer = this.decode(encoded);
    return new TextDecoder().decode(buffer);
  }

  /**
   * Encode JSON to Willow Base-22
   */
  static encodeJSON(obj: any): string {
    const json = JSON.stringify(obj);
    return this.encodeString(json);
  }

  /**
   * Decode Willow Base-22 to JSON
   */
  static decodeJSON(encoded: string): any {
    const json = this.decodeString(encoded);
    return JSON.parse(json);
  }

  /**
   * Calculate compression ratio vs base64
   */
  static compressionRatio(data: string): number {
    const buffer = new TextEncoder().encode(data);
    const base64Length = encodeUint8ArrayToBase64(buffer).length;
    const willowLength = this.encode(buffer).length;
    return base64Length / willowLength;
  }

  /**
   * Get statistics about Willow encoding
   */
  static getStats(encoded: string): {
    length: number;
    letterDistribution: Map<string, number>;
    gematriaSum: number;
    dominantLetter: string;
  } {
    const distribution = new Map<string, number>();
    let gematriaSum = 0;
    
    for (const char of encoded) {
      distribution.set(char, (distribution.get(char) || 0) + 1);
      const letter = HEBREW_ALPHABET.find(l => l.letter === char);
      if (letter) {
        gematriaSum += letter.gematria;
      }
    }
    
    // Find dominant letter
    let maxCount = 0;
    let dominantLetter = '';
    for (const [char, count] of Array.from(distribution.entries())) {
      if (count > maxCount) {
        maxCount = count;
        dominantLetter = char;
      }
    }
    
    return {
      length: encoded.length,
      letterDistribution: distribution,
      gematriaSum,
      dominantLetter
    };
  }
}

/**
 * Semantic Willow Dictionary - Map concepts to Hebrew letters
 */
export class WillowDictionary {
  // Common JSON keys to single Hebrew letters
  private static readonly KEY_MAP = new Map<string, string>([
    ['wpa', 'א'],      // Aleph - Unity, the address
    ['concept', 'ב'],  // Bet - House, container of meaning
    ['category', 'ג'], // Gimel - Bridge between concepts
    ['gematria', 'ד'], // Dalet - Door to numeric meaning
    ['connections', 'ה'], // He - Breath, life-giving links
    ['content', 'ו'],  // Vav - Connection, the actual content
    ['metadata', 'ז'], // Zayin - Weapon, protective info
    ['timestamp', 'ח'], // Chet - Life, time
    ['confidence', 'ט'], // Tet - Good, quality measure
    ['source', 'י'],   // Yod - Hand, origin
    ['id', 'כ'],       // Kaf - Grasp
    ['letterPath', 'ל'], // Lamed - Learn, the path
  ]);

  private static readonly REVERSE_MAP = new Map<string, string>(
    Array.from(this.KEY_MAP.entries()).map(([k, v]) => [v, k])
  );

  /**
   * Compress JSON using semantic dictionary
   */
  static compress(json: string): string {
    let compressed = json;
    
    // Replace keys with Hebrew letters
    for (const [key, letter] of Array.from(this.KEY_MAP.entries())) {
      const regex = new RegExp(`"${key}":`, 'g');
      compressed = compressed.replace(regex, `"${letter}":`);
    }
    
    return compressed;
  }

  /**
   * Decompress back to JSON
   */
  static decompress(compressed: string): string {
    let json = compressed;
    
    // Replace Hebrew letters back to keys
    for (const [letter, key] of Array.from(this.REVERSE_MAP.entries())) {
      const regex = new RegExp(`"${letter}":`, 'g');
      json = json.replace(regex, `"${key}":`);
    }
    
    return json;
  }
}

/**
 * Compact Willow Notation - Even more compressed using patterns
 */
export class CompactWillow {
  /**
   * Detect and compress repeating patterns
   */
  static compressPatterns(willowEncoded: string): string {
    // Find repeating sequences and replace with count notation
    // e.g., "אאאא" -> "א×4"
    let compressed = willowEncoded;
    
    // Pattern: Same letter repeated
    for (const letter of HEBREW_ALPHABET) {
      const char = letter.letter;
      const regex = new RegExp(`${char}{2,}`, 'g');
      compressed = compressed.replace(regex, (match) => {
        if (match.length >= 3) {
          return `${char}×${match.length}`;
        }
        return match;
      });
    }
    
    return compressed;
  }

  /**
   * Decompress pattern notation
   */
  static decompressPatterns(compressed: string): string {
    // Expand count notation back to full sequence
    const regex = /([א-ת])×(\d+)/g;
    return compressed.replace(regex, (match, char, count) => {
      return char.repeat(parseInt(count, 10));
    });
  }

  /**
   * Full encode with pattern compression
   */
  static encode(data: string): string {
    const willowBase = WillowBase.encodeString(data);
    return this.compressPatterns(willowBase);
  }

  /**
   * Full decode with pattern decompression
   */
  static decode(compressed: string): string {
    const willowBase = this.decompressPatterns(compressed);
    return WillowBase.decodeString(willowBase);
  }
}
