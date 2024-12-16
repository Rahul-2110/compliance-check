
import axios from 'axios';
import * as cheerio from 'cheerio';

import logger from '../utils/logger';
import { AppError } from './types/compliance';

const extractContent = async (url: string, content: string): Promise<string> => {
    try {
        let $
        if(!content) {
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Compliance-Checker-Bot/1.0'
                },
                timeout: 10000
            });
            $ = cheerio.load(response.data);
        }else {
            $ = cheerio.load(content);
        }
    

        // Remove unwanted elements
        $('script').remove();
        $('style').remove();
        $('noscript').remove();
        $('iframe').remove();

        // Extract text content
        content = $('body')
            .text()
            .trim()
            .replace(/\s+/g, ' ');

        logger.debug('Content extracted successfully', { url });
        return content;
    } catch (error) {
        logger.error('Failed to extract content:', {
            url,
            error: error.message
        });

        throw new AppError(
            503,
            `Failed to fetch content from ${url}: ${error.message}`
        );
    }
};

export default extractContent;


