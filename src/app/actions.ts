'use server';

import { extractArchitectureInput } from '@/ai/extractor';
import { recommendArchitecture } from '@/engine';
import { EngineResponse } from '@/engine/types';
import { db } from '@/db';
import { architectureReviews } from '@/db/schema';
import { sql } from 'drizzle-orm';

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
      // Ensure the table exists in production without needing a CLI migration
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS "architecture_reviews" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          "extracted_domains" jsonb,
          "architecture_style" varchar(255),
          "top_risks" jsonb,
          "blind_spots" jsonb,
          "generation_time_ms" integer,
          "status" varchar(50),
          "error_message" varchar,
          "created_at" timestamp NOT NULL DEFAULT now()
        );
      `).catch(e => console.error("Table creation failed:", e));

      // 3. Log the successful review to the database
      // Note: We deliberately exclude the prompt for privacy
      await db.insert(architectureReviews).values([{
        status: 'success',
        extractedDomains: sql`${JSON.stringify(extractedInput.archetypes.map(a => a.name))}::jsonb` as any,
        architectureStyle: output.data.architectureStyle,
        topRisks: sql`${JSON.stringify(output.data.businessRisks.map(r => r.risk))}::jsonb` as any,
        blindSpots: sql`${JSON.stringify(output.data.domainBlindSpots || [])}::jsonb` as any,
        generationTimeMs: Date.now() - startTime,
      }]);
    }

    return output;
  } catch (error: any) {
    console.error('Error processing architecture request:', error);
    
    // Dump the full error object for debugging
    const fullError = JSON.stringify(error, Object.getOwnPropertyNames(error));
    let errorMessage = `DB ERROR TRACE: ${fullError}`;

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
