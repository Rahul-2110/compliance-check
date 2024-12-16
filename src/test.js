const cheerio = require('cheerio');
const axios = require('axios');

async function extractTextContent(url) {
    try {
        // Make the HTTP request
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        // Load HTML content into cheerio
        const $ = cheerio.load(response.data);

        // Object to store our extracted content
        const content = {
            headers: [],
            paragraphs: [],
            structuredContent: [] // Combined content in order of appearance
        };

        // Extract all header content (h1-h6)
        $('h1, h2, h3, h4, h5, h6').each((index, element) => {
            const headerText = $(element).text().trim();
            const headerLevel = element.name; // gets 'h1', 'h2', etc.
            
            if (headerText) {
                content.headers.push({
                    level: headerLevel,
                    text: headerText,
                    position: $(element).index()
                });

                content.structuredContent.push({
                    type: 'header',
                    level: headerLevel,
                    text: headerText,
                    position: $(element).index()
                });
            }
        });

        // Extract all paragraph content
        $('p').each((index, element) => {
            const paragraphText = $(element).text().trim();
            
            if (paragraphText) {
                content.paragraphs.push({
                    text: paragraphText,
                    position: $(element).index()
                });

                content.structuredContent.push({
                    type: 'paragraph',
                    text: paragraphText,
                    position: $(element).index()
                });
            }
        });

        // Sort structured content by position to maintain document flow
        content.structuredContent.sort((a, b) => a.position - b.position);

        // Remove position properties as they're no longer needed
        content.structuredContent = content.structuredContent.map(({ position, ...item }) => item);

        return content;
    } catch (error) {
        console.error('Error extracting content:', error.message);
        throw error;
    }
}

// Function to clean and format extracted text
function formatExtractedContent(content) {
    return {
        ...content,
        plainText: {
            headersOnly: content.headers.map(h => h.text).join('\n\n'),
            paragraphsOnly: content.paragraphs.map(p => p.text).join('\n\n'),
            everything: content.structuredContent
                .map(item => item.text)
                .join('\n\n')
        }
    };
}

// Example usage
async function main() {
    try {
        const url = 'https://example.com';
        const extractedContent = await extractTextContent(url);
        const formattedContent = formatExtractedContent(extractedContent);

        // Output the results
        console.log('\n=== Headers ===');
        formattedContent.headers.forEach(header => {
            console.log(`${header.level}: ${header.text}`);
        });

        console.log('\n=== Paragraphs ===');
        formattedContent.paragraphs.forEach(paragraph => {
            console.log(paragraph.text);
            console.log('---');
        });

        console.log('\n=== Structured Content ===');
        formattedContent.structuredContent.forEach(item => {
            console.log(`[${item.type}${item.level ? ` ${item.level}` : ''}]`);
            console.log(item.text);
            console.log('---');
        });

        // Save to file if needed
        const fs = require('fs').promises;
        await fs.writeFile(
            'extracted_content.json', 
            JSON.stringify(formattedContent, null, 2)
        );

    } catch (error) {
        console.error('Error in main:', error);
    }
}

module.exports = {
    extractTextContent,
    formatExtractedContent
};