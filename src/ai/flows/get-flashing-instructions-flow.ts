

'use server';
/**
 * @fileOverview An AI flow to generate flashing instructions for a given mobile device brand.
 *
 * - getFlashingInstructions - A function that returns flashing instructions.
 * - FlashingInstructionsInput - The input type for the getFlashingInstructions function.
 * - FlashingInstructionsOutput - The return type for the getFlashingInstructions function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import slugify from 'slugify';

const createId = (name: string) => slugify(name, { lower: true, strict: true });

const FlashingInstructionsInputSchema = z.object({
  brandName: z.string().describe('The name of the mobile device brand, e.g., "Samsung" or "Google Pixel".'),
});
export type FlashingInstructionsInput = z.infer<typeof FlashingInstructionsInputSchema>;

const InstructionStepSchema = z.object({
  title: z.string().describe("A short, clear title for the instruction step."),
  description: z.string().describe("A detailed description of the action to take in this step."),
});

const FlashingInstructionToolSchema = z.object({
    name: z.string().describe("The name of the primary flashing tool required, e.g., 'Odin' or 'fastboot'."),
    slug: z.string().describe("A URL-friendly slug for the tool name, e.g., 'odin-tool' or 'fastboot'."),
});

const FlashingInstructionsOutputSchema = z.object({
    introduction: z.string().describe("A brief introduction to the flashing process for this brand, including any common tools used (e.g., Odin for Samsung, fastboot for Pixel). It should mention 'stock ROM download', 'firmware' and 'flash file'."),
    prerequisites: z.array(z.string()).describe("A list of prerequisites or things the user needs before starting, like specific drivers or software."),
    instructions: z.array(InstructionStepSchema).describe("An array of step-by-step instructions to flash the firmware."),
    warning: z.string().describe("An important warning or disclaimer about the risks of flashing firmware (e.g., data loss, voiding warranty)."),
    tool: FlashingInstructionToolSchema.optional().describe("The primary tool required for the flashing process."),
});
export type FlashingInstructionsOutput = z.infer<typeof FlashingInstructionsOutputSchema>;


export async function getFlashingInstructions(input: FlashingInstructionsInput): Promise<FlashingInstructionsOutput> {
  return getFlashingInstructionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'flashingInstructionsPrompt',
  input: { schema: FlashingInstructionsInputSchema },
  output: { schema: FlashingInstructionsOutputSchema },
  prompt: `
    You are an expert mobile device technician. Your task is to provide clear, step-by-step instructions for flashing stock firmware (also known as a stock ROM or flash file) onto a device of a specific brand.

    The user will provide a brand name. Based on that brand, generate a set of generic flashing instructions.
    The primary methods are Odin (for Samsung) and fastboot (for most other Androids like Google Pixel, Xiaomi, OnePlus, Motorola).
    Your generated instructions should be for one of these two methods, chosen based on the brand.

    - For "Samsung", the instructions should be based on using the Odin tool. You MUST identify "Odin" as the tool.
    - For most other modern Android brands like "Google Pixel", "Xiaomi", "OnePlus", or "Motorola", the instructions should be based on using fastboot commands. You MUST identify "fastboot" as the tool.
    - For the identified tool, provide its name and a URL-friendly slug. For example, if the tool is "Odin", the name is "Odin" and the slug is "odin".
    
    Generate the introduction, prerequisites, step-by-step instructions, and a final warning. The introduction must mention the term "stock ROM download", "firmware", and "flash file".
    Assume the user has already completed their stock ROM download and has the correct firmware file or flash file.
    Focus on the process of flashing, not on finding or downloading the firmware or flash file.

    Brand: {{{brandName}}}
  `,
});

const getFlashingInstructionsFlow = ai.defineFlow(
  {
    name: 'getFlashingInstructionsFlow',
    inputSchema: FlashingInstructionsInputSchema,
    outputSchema: FlashingInstructionsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate flashing instructions.');
    }
    
    // Ensure the slug is correctly formatted, as the AI might make a mistake.
    if (output.tool) {
        output.tool.slug = createId(output.tool.name);
    }

    return output;
  }
);




