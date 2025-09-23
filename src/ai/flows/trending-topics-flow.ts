
'use server';
/**
 * @fileOverview An AI flow to generate trending blog post topics.
 *
 * - generateTrendingTopics - Generates a list of trending topics.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TrendingTopicsOutputSchema = z.object({
  topics: z.array(z.string()).describe("A list of 5-10 trending blog post topics."),
});
type TrendingTopicsOutput = z.infer<typeof TrendingTopicsOutputSchema>;

export async function generateTrendingTopics(): Promise<TrendingTopicsOutput> {
  return trendingTopicsFlow();
}

const prompt = ai.definePrompt({
  name: 'trendingTopicsPrompt',
  output: { schema: TrendingTopicsOutputSchema },
  prompt: `
    You are a mobile technology and SEO expert for a firmware download website.
    Your task is to generate a list of 5 to 10 current, trending, and highly searchable blog post topics.

    The topics should be relevant to:
    - Firmware flashing
    - Stock ROMs vs. Custom ROMs
    - Unbricking devices
    - Mobile device repair and software maintenance
    - Specific popular device models (e.g., new Samsung or Pixel phones)
    - How-to guides for tools like Odin or fastboot
    - Android updates and features

    Generate a list of compelling, user-focused topics that someone trying to fix or update their phone would search for.
    Present the output as a list of topics.
  `,
});

const trendingTopicsFlow = ai.defineFlow(
  {
    name: 'trendingTopicsFlow',
    outputSchema: TrendingTopicsOutputSchema,
  },
  async () => {
    const { output } = await prompt({});
    if (!output) {
      throw new Error('Failed to generate trending topics.');
    }
    return output;
  }
);
