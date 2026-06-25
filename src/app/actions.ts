'use server';

import { extractArchitectureInput } from '@/ai/extractor';
import { recommendArchitecture } from '@/engine';
import { EngineResponse } from '@/engine/types';

export async function processArchitectureRequest(prompt: string): Promise<EngineResponse> {
  if (!prompt || prompt.trim() === '') {
    throw new Error('Prompt cannot be empty');
  }

  try {
    // 1. Extract structured data from the prompt using AI
    const extractedInput = await extractArchitectureInput(prompt);

    if (extractedInput.isValidRequest === false) {
      return { 
        status: 'error', 
        message: 'I can only analyze software projects. Please describe a specific application, system, or platform you want to build.' 
      };
    }

    // 2. Run the deterministic Rules Engine
    const output = recommendArchitecture(extractedInput);

    return output;
  } catch (error) {
    console.error('Error processing architecture request:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred.';
    return { status: 'error', message: `Server Error: ${errorMessage}` };
  }
}
