// FIX: Corrected import path for local module by adding file extension.
import { marked } from 'marked';
import JSZip from 'jszip';
import { 
    canonLog, 
    conversationHistory, 
    landmark,
    readme
} from './chronicles.data.ts';

function createHtmlPage(title: string, content: string): string {
    const htmlContent = marked.parse(content);
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
            <style>
                body { 
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    line-height: 1.6;
                    background-color: #0a0a0a;
                    color: #e0e0e0;
                    max-width: 800px;
                    margin: 20px auto;
                    padding: 20px;
                }
                h1, h2, h3 { color: #0f0; border-bottom: 1px solid #0f0; padding-bottom: 5px; }
                a { color: #0ff; }
                code { background-color: #222; padding: 2px 5px; border-radius: 3px; }
                pre { background-color: #111; padding: 10px; border-radius: 5px; overflow-x: auto; }
                blockquote { border-left: 3px solid #0f0; padding-left: 15px; color: #ccc; }
                nav { margin-bottom: 20px; border-bottom: 2px solid #0f0; padding-bottom: 10px; }
                nav a { margin-right: 15px; }
            </style>
        </head>
        <body>
            <nav>
                <a href="index.html">Home (README)</a>
                <a href="Landmark.html">Landmark (Prime Directive)</a>
                <a href="canon.log.html">Canon Log</a>
                <a href="conversation_history.html">Conversation History</a>
            </nav>
            <h1>${title}</h1>
            ${htmlContent}
        </body>
        </html>
    `;
}

export async function compileAndDownloadChronicle(): Promise<void> {
    const zip = new JSZip();

    const files = {
        'index.html': { title: 'The Astrian Key™: Operator\'s Manual', content: readme },
        'Landmark.html': { title: 'Landmark (Prime Directive)', content: landmark },
        'canon.log.html': { title: 'Canon Log', content: canonLog },
        'conversation_history.html': { title: 'Conversation History', content: conversationHistory },
    };

    for (const [filename, data] of Object.entries(files)) {
        const html = createHtmlPage(data.title, data.content);
        zip.file(filename, html);
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(zipBlob);
    link.download = 'The_Astrian_Key_Chronicle.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}