'use server';

import { extractArchitectureInput } from '@/ai/extractor';
import { recommendArchitecture } from '@/engine';
import { EngineResponse } from '@/engine/types';
import { db } from '@/db';
import { architectureReviews } from '@/db/schema';

export async function processArchitectureRequest(prompt: string): Promise<EngineResponse> {
  if (!prompt || prompt.trim() === '') {
    throw new Error('Prompt cannot be empty');
  }

  const startTime = Date.now();

  try {
    // 1. Extract structured data from the prompt using AI
    const extractedInput = await extractArchitectureInput(prompt);

    if (extractedInput.isValidRequest === false) {
      await db.insert(architectureReviews).values([{
        status: 'error',
        errorMessage: 'Invalid request: not a software project',
        generationTimeMs: Date.now() - startTime,
      }]);

      return { 
        status: 'error', 
        message: 'I can only analyze software projects. Please describe a specific application, system, or platform you want to build.' 
      };
    }

    // 2. Run the deterministic Rules Engine
    const output = recommendArchitecture(extractedInput);

    if (output.status === 'success') {
      // 3. Log the successful review to the database
      // Note: We deliberately exclude the prompt for privacy
      await db.insert(architectureReviews).values([{
        status: 'success',
        extractedDomains: JSON.stringify(extractedInput.archetypes.map(a => a.name)) as any,
        architectureStyle: output.data.architectureStyle,
        topRisks: JSON.stringify(output.data.businessRisks.map(r => r.risk)) as any,
        blindSpots: JSON.stringify(output.data.domainBlindSpots || []) as any,
        generationTimeMs: Date.now() - startTime,
      }]);
    }

    return output;
  } catch (error) {
    console.error('Error processing architecture request:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const generationTimeMs = Date.now() - startTime;
    
    await db.insert(architectureReviews).values([{
      status: 'error',
      errorMessage: errorMessage,
      generationTimeMs,
    }]).catch(e => console.error("Failed to log error to DB:", e));

    // Catch rate limit errors from Gemini API
    if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
      return { 
        status: 'error', 
        message: 'Wow, we are getting a lot of traffic right now! The AI engine is taking a quick breather. Please try again in 10 seconds.' 
      };
    }

    return { status: 'error', message: `Server Error: ${errorMessage}` };
  }
}
