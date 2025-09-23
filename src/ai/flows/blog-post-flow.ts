
'use server';
/**
 * @fileOverview An AI flow to generate a blog post about a mobile tech topic.
 *
 * - generateBlogPost - Generates a blog post.
 * - BlogPostInput - The input type for the function.
 * - BlogPostOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const BlogPostInputSchema = z.object({
  topic: z.string().describe('The topic for the blog post, e.g., "How to flash Samsung firmware".'),
});
export type BlogPostInput = z.infer<typeof BlogPostInputSchema>;

export const BlogPostOutputSchema = z.object({
  title: z.string().describe("A catchy and SEO-friendly title for the blog post."),
  excerpt: z.string().describe("A short, compelling summary of the blog post (1-2 sentences)."),
  content: z.string().describe("The full content of the blog post in Markdown format. Should be well-structured with headings, lists, and bold text."),
});
export type BlogPostOutput = z.infer<typeof BlogPostOutputSchema>;

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
    - Written in a clear, accessible tone that both beginners and intermediate users can understand.
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
