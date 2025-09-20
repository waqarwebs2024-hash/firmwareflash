
'use server';
/**
 * @fileOverview An AI flow to analyze a webpage's HTML content for SEO best practices.
 *
 * - generateSeoReport - A function that returns an SEO analysis.
 * - SeoReportInput - The input type for the function.
 * - SeoReport - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SeoReportInputSchema = z.object({
  pageHtml: z.string().describe('The full HTML content of the webpage to analyze.'),
});
export type SeoReportInput = z.infer<typeof SeoReportInputSchema>;

const SeoReportOutputSchema = z.object({
  score: z.number().min(0).max(100).describe('An overall SEO score from 0 to 100 based on the analysis.'),
  whatIsGood: z.array(z.string()).describe("A list of positive points and things the page is doing well for SEO."),
  whatToImprove: z.array(z.string()).describe("A list of issues or areas where the page's SEO could be improved."),
  recommendations: z.array(z.string()).describe("A list of concrete, actionable recommendations to improve the page's SEO score."),
});
export type SeoReport = z.infer<typeof SeoReportOutputSchema>;

export async function generateSeoReport(input: SeoReportInput): Promise<SeoReport> {
  return seoReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'seoReportPrompt',
  input: { schema: SeoReportInputSchema },
  output: { schema: SeoReportOutputSchema },
  prompt: `
    You are an expert SEO analyzer. Your task is to analyze the provided HTML content of a webpage and give a detailed report on its on-page SEO quality. The website is a "Firmware Finder" for mobile devices.

    Analyze the following HTML content based on these key on-page SEO factors:
    1.  **Title Tag (\`<title>\`):** Is it present, descriptive, and within the optimal length (50-60 characters)? Does it contain relevant keywords?
    2.  **Meta Description:** Is it present, compelling, and within the optimal length (150-160 characters)? Does it naturally include keywords?
    3.  **Heading Structure (H1, H2, H3, etc.):** Is there a single, clear H1 tag? Is the heading hierarchy logical? Do headings use relevant keywords?
    4.  **Content Quality:** Is the content substantial and relevant to the likely user intent (downloading firmware, finding instructions)? Are keywords used naturally?
    5.  **Internal Linking:** Are there internal links to other relevant pages on the site?
    6.  **Image SEO:** Do \`<img>\` tags have descriptive \`alt\` attributes?
    7.  **Schema Markup:** Is there any structured data (like JSON-LD for FAQ, HowTo, or Breadcrumbs) to help search engines understand the content?

    Based on your analysis, provide the following:
    -   **Score:** An overall SEO score from 0 to 100. Be critical. A perfectly optimized page is 100. A page with no SEO considerations is 0.
    -   **What Is Good:** A bulleted list of 3-5 things the page is doing correctly.
    -   **What to Improve:** A bulleted list of 3-5 specific issues or weaknesses found.
    -   **Recommendations:** A bulleted list of concrete, actionable steps the user can take to fix the issues and improve the score.

    Analyze this HTML:
    \`\`\`html
    {{{pageHtml}}}
    \`\`\`
  `,
});

const seoReportFlow = ai.defineFlow(
  {
    name: 'seoReportFlow',
    inputSchema: SeoReportInputSchema,
    outputSchema: SeoReportOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate SEO report.');
    }
    return output;
  }
);
