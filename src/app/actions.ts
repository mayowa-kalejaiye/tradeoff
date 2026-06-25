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

    // 2. Run the deterministic Rules Engine
    const output = recommendArchitecture(extractedInput);

    return output;
  } catch (error) {
    console.error('Error processing architecture request:', error);
    throw new Error('Failed to process architecture request. Please try again.');
  }
}
