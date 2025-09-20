import {genkit, GenerationCommonConfig} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import { getApiKey } from '@/lib/data';

// This function is defined outside of the genkit call so it can be async
async function getGoogleAIPlugin() {
  const apiKey = await getApiKey();
  const config: GenerationCommonConfig = {};
  
  // Only pass the apiKey if it exists, otherwise the plugin will
  // fall back to the GOOGLE_API_KEY or GEMINI_API_KEY environment variables.
  if (apiKey) {
    return googleAI({ apiKey });
  }
  
  return googleAI();
}

export const ai = genkit({
  plugins: [await getGoogleAIPlugin()],
  model: 'googleai/gemini-2.5-flash',
});
