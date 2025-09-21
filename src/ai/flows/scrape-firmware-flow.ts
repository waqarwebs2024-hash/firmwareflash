
'use server';
/**
 * @fileOverview An AI flow to scrape firmware information from a given URL.
 *
 * - scrapeFirmwareFlow - A function that returns scraped firmware data.
 * - ScrapeFirmwareInput - The input type for the scrapeFirmwareFlow function.
 * - ScrapeFirmwareOutput - The return type for the scrapeFirmwareFlow function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import puppeteer from 'puppeteer-core';
import chrome from 'chrome-aws-lambda';
import cheerio from 'cheerio';

const ScrapeFirmwareInputSchema = z.object({
  url: z.string().url().describe('The URL of the webpage to scrape for firmware information.'),
});
export type ScrapeFirmwareInput = z.infer<typeof ScrapeFirmwareInputSchema>;

const ScrapeFirmwareOutputSchema = z.object({
  fileName: z.string().describe('The name of the firmware file.'),
  version: z.string().describe('The version of the firmware.'),
  androidVersion: z.string().describe('The Android version if available, otherwise "N/A".'),
  size: z.string().describe('The size of the firmware file.'),
  downloadUrl: z.string().url().describe('The direct download link (only from GDrive, Mega.nz, or MediaFire).'),
  sourceUrl: z.string().url().describe('The original URL the data was scraped from.'),
});
export type ScrapeFirmwareOutput = z.infer<typeof ScrapeFirmwareOutputSchema>;


async function getBrowser() {
    const executablePath = await chrome.executablePath;

    return puppeteer.launch({
        args: chrome.args,
        executablePath,
        headless: chrome.headless,
    });
}

async function getPageContent(url: string) {
    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    // Basic Cloudflare bypass attempt
    const title = await page.title();
    if (title === 'Just a moment...') {
        await new Promise(r => setTimeout(r, 5000)); // Wait for challenge
    }

    const content = await page.content();
    await browser.close();
    return content;
}

const prompt = ai.definePrompt({
  name: 'firmwareScrapePrompt',
  input: { schema: z.object({ htmlContent: z.string() }) },
  output: { schema: ScrapeFirmwareOutputSchema.omit({ sourceUrl: true }) },
  prompt: `
    You are an expert firmware data extractor. Your task is to analyze the provided HTML content of a webpage and extract firmware details.

    Analyze the following HTML content and extract the required information:
    1.  **File Name:** The full name of the firmware file (e.g., "SM-G998B_U1_G998BXXU1AUB6_... .zip").
    2.  **Version:** The firmware version string (e.g., "G998BXXU1AUB6"). If not explicitly found, extract it from the file name.
    3.  **Android Version:** The Android OS version (e.g., "11" or "12"). If not found, use "N/A".
    4.  **Size:** The file size (e.g., "4.5 GB").
    5.  **Download URL:** Find the download link. It MUST be from one of the following domains: drive.google.com, mega.nz, mediafire.com. If the link is on a subsequent page, you must identify that link.

    HTML Content to analyze:
    \`\`\`html
    {{{htmlContent}}}
    \`\`\`
  `,
});

export const scrapeFirmwareFlow = ai.defineFlow(
  {
    name: 'scrapeFirmwareFlow',
    inputSchema: ScrapeFirmwareInputSchema,
    outputSchema: ScrapeFirmwareOutputSchema,
  },
  async ({ url }) => {
    const htmlContent = await getPageContent(url);
    const $ = cheerio.load(htmlContent);

    // Let the AI do a first pass to get most of the data
    const { output } = await prompt({ htmlContent });

    if (!output) {
        throw new Error('AI could not extract firmware data from the page.');
    }

    // Use cheerio to find the download link more reliably
    let downloadUrl = '';
    const allowedDomains = ['drive.google.com', 'mega.nz', 'mediafire.com'];
    $('a').each((i, el) => {
        const href = $(el).attr('href');
        if (href) {
            try {
                const urlObject = new URL(href);
                if (allowedDomains.includes(urlObject.hostname)) {
                    downloadUrl = href;
                    return false; // stop iterating
                }
            } catch (e) {
                // Ignore invalid URLs
            }
        }
    });

    if (!downloadUrl) {
        throw new Error("Could not find a valid download link from the allowed domains.");
    }
    
    // If the found link is a redirect page on the same site, we need to follow it.
    const urlHost = new URL(url).hostname;
    if(new URL(downloadUrl).hostname.includes(urlHost)) {
         const finalPageContent = await getPageContent(downloadUrl);
         const $final = cheerio.load(finalPageContent);
         $final('a').each((i, el) => {
            const href = $final(el).attr('href');
            if (href) {
                try {
                    const urlObject = new URL(href);
                    if (allowedDomains.includes(urlObject.hostname)) {
                        downloadUrl = href;
                        return false;
                    }
                } catch(e) {/* ignore */}
            }
        });
    }

    return {
        ...output,
        downloadUrl,
        sourceUrl: url,
    };
  }
);
