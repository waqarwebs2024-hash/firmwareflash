
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

    The blog post MUST be:
    - Well-structured with a clear introduction, body, and conclusion.
    - Formatted in clean Markdown. Use headings (e.g., #, ##), lists (e.g., * or 1.), and bold text (e.g., **text**) to improve readability. Do NOT output a single block of unformatted text.
    - SEO-friendly, naturally incorporating keywords related to the topic.
    - At least 500 words long.

    Here is an example of good formatting:

    # This is a Title
    
    This is an introduction.

    ## This is a Subheading
    * This is a list item.
    * **This** is a bolded list item.

    1. This is a numbered list.
    2. Another item.

    ---

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
