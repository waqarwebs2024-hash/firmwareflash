
'use server';
/**
 * @fileOverview An AI flow to generate a blog post about a mobile tech topic.
 *
 * - generateBlogPost - Generates a blog post.
 */

import { ai } from '@/ai/genkit';
import { BlogPostInput, BlogPostInputSchema, BlogPostOutput, BlogPostOutputSchema } from '@/lib/types';


export async function generateBlogPost(input: BlogPostInput): Promise<BlogPostOutput> {
  return blogPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'blogPostPrompt',
  input: { schema: BlogPostInputSchema },
  output: { schema: BlogPostOutputSchema },
  prompt: `
    You are an expert tech blogger specializing in mobile devices, firmware, and software modification. Your task is to write a detailed, engaging, and informative blog post on the given topic.

    The blog post should be:
    - Well-structured with a clear introduction, body, and conclusion.
    - Formatted in clean Markdown. Use headings (#, ##, ###), lists (* or 1.), and bold text (**) to improve readability.
    - SEO-friendly, naturally incorporating keywords related to the topic.
    - At least 500 words long.

    Generate a catchy title, a short excerpt (1-2 sentences), and the full blog post content in Markdown.

    Topic: {{{topic}}}
  `,
});

const blogPostFlow = ai.defineFlow(
  {
    name: 'blogPostFlow',
    inputSchema: BlogPostInputSchema,
    outputSchema: BlogPostOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate blog post.');
    }
    return output;
  }
);
