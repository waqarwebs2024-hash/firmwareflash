
'use server';
/**
 * @fileOverview An AI flow to detect the CPU type from a firmware file name.
 *
 * - getCpuType - A function that returns the detected CPU type.
 * - CpuTypeInput - The input type for the function.
 * - CpuTypeOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { CpuTypeInput, CpuTypeInputSchema, CpuTypeOutput, CpuTypeOutputSchema } from '@/lib/types';


export async function getCpuType(input: CpuTypeInput): Promise<CpuTypeOutput> {
  return getCpuTypeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cpuTypePrompt',
  input: { schema: CpuTypeInputSchema },
  output: { schema: CpuTypeOutputSchema },
  prompt: `
    Analyze the following firmware file name and determine the CPU/SoC family. 

    - If the name contains "Exynos", the CPU is "exynos".
    - If the name mentions "Snapdragon", "SM", or "SDM", the CPU is "qualcomm".
    - If the name contains "MTK", "MT", or "Helio", the CPU is "mediatek".
    - If the name contains "Kirin" or "HiSilicon", the CPU is "kirin".
    - If the name contains "SPD" or "Spreadtrum", the CPU is "spd".
    - Most Samsung devices use either "exynos" or "qualcomm". If you can't determine from the filename, default to "qualcomm" for Samsung.
    - Most other devices (Google, Xiaomi, OnePlus, Motorola) are likely "qualcomm" if not specified.
    - Tecno, Infinix, Itel, and similar brands are most likely "mediatek".
    - If none of the above match, classify as "other".

    Firmware File Name: {{{fileName}}}
  `,
});

const getCpuTypeFlow = ai.defineFlow(
  {
    name: 'getCpuTypeFlow',
    inputSchema: CpuTypeInputSchema,
    outputSchema: CpuTypeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      // Default to a generic instruction set if AI fails
      return { cpuType: 'other' };
    }
    
    // For Samsung devices, if AI is unsure ('other'), default to 'qualcomm' as it's more common.
    // The 'other' category in our RTDB will point to Odin/Fastboot instructions anyway.
    if (input.fileName.toLowerCase().includes('samsung') && output.cpuType === 'other') {
        return { cpuType: 'qualcomm' };
    }

    return output;
  }
);
