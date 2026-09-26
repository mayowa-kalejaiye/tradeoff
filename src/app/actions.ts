'use server';

import { extractArchitectureInput } from '@/ai/extractor';
import { recommendArchitecture } from '@/engine';
import { EngineResponse } from '@/engine/types';
import { db } from '@/db';
import { architectureReviews } from '@/db/schema';
import { sql } from 'drizzle-orm';

import { eq } from 'drizzle-orm';

export async function processArchitectureRequest(prompt: string, isPrivate: boolean = false): Promise<EngineResponse> {
  if (!prompt || prompt.trim() === '') {
    throw new Error('Prompt cannot be empty');
  }

  const startTime = Date.now();

  // Ensure tables and columns exist in production
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

  await db.execute(sql`
    ALTER TABLE "architecture_reviews" ADD COLUMN IF NOT EXISTS "prompt_length" integer;
    ALTER TABLE "architecture_reviews" ADD COLUMN IF NOT EXISTS "input_tokens" integer;
    ALTER TABLE "architecture_reviews" ADD COLUMN IF NOT EXISTS "output_tokens" integer;
    ALTER TABLE "architecture_reviews" ADD COLUMN IF NOT EXISTS "total_cost" real;
    ALTER TABLE "architecture_reviews" ADD COLUMN IF NOT EXISTS "unknown_technologies" jsonb;
    ALTER TABLE "architecture_reviews" ADD COLUMN IF NOT EXISTS "missing_niches" jsonb;
    ALTER TABLE "architecture_reviews" ADD COLUMN IF NOT EXISTS "confidence_score" integer;
    ALTER TABLE "architecture_reviews" ADD COLUMN IF NOT EXISTS "raw_input" jsonb;
    ALTER TABLE "architecture_reviews" ADD COLUMN IF NOT EXISTS "raw_output" jsonb;
  `).catch(e => console.error("Alter table failed:", e));

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "engine_updates" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "description" varchar(500) NOT NULL,
      "created_at" timestamp NOT NULL DEFAULT now()
    );
  `).catch(e => console.error("Engine updates table creation failed:", e));

  let recordId: string | null = null;

  try {
    // 1. Log "started" state
    const newRecord = await db.insert(architectureReviews).values({
      status: 'started',
      promptLength: prompt.length,
    }).returning({ id: architectureReviews.id });

    if (newRecord.length > 0) {
      recordId = newRecord[0].id;
    }

    // 2. Enforce prompt length pushback
    const wordCount = prompt.trim().split(/\s+/).length;
    if (wordCount < 15) {
      if (recordId) {
        await db.update(architectureReviews).set({
          status: 'error',
          errorMessage: 'Prompt too vague (under 15 words)',
          generationTimeMs: Date.now() - startTime,
        }).where(eq(architectureReviews.id, recordId));
      }
      return {
        status: 'uncertainty',
        reason: 'Your prompt is too vague. To recommend a proper architecture, I need to know more about the constraints.',
        questions: [
          'What is your expected scale (e.g. number of users or transactions)?',
          'What is the priority for this project (e.g. speed to market, massive scale, strict reliability)?',
          'What is the size of the engineering team that will maintain this?'
        ]
      };
    }

    // 3. Extract structured data from the prompt using AI
    const { input: extractedInput, usage } = await extractArchitectureInput(prompt);

    const inputTokens = (usage as any).inputTokens ?? usage.promptTokens ?? 0;
    const outputTokens = (usage as any).outputTokens ?? usage.completionTokens ?? 0;
    const totalCost = (inputTokens / 1000000) * 0.075 + (outputTokens / 1000000) * 0.30;

    if (extractedInput.isValidRequest === false) {
      if (recordId) {
        await db.update(architectureReviews).set({
          status: 'error',
          errorMessage: 'Invalid request: not a software project',
          generationTimeMs: Date.now() - startTime,
          inputTokens,
          outputTokens,
          totalCost: Number(totalCost) || 0,
        }).where(eq(architectureReviews.id, recordId));
      }

      return {
        status: 'error',
        message: 'I can only analyze software projects. Please describe a specific application, system, or platform you want to build.'
      };
    }

    // 4. Run the Generative Adaptation Engine
    const output = await recommendArchitecture(extractedInput, prompt);

    // Merge the AI usage from the adaptation step
    const adaptationInputTokens = output.usage?.promptTokens || 0;
    const adaptationOutputTokens = output.usage?.completionTokens || 0;

    const finalInputTokens = inputTokens + adaptationInputTokens;
    const finalOutputTokens = outputTokens + adaptationOutputTokens;
    const finalTotalCost = (finalInputTokens / 1000000) * 0.075 + (finalOutputTokens / 1000000) * 0.30;

    if (output.status === 'success') {
      // 5. Log the successful review to the database
      if (recordId) {
        await db.update(architectureReviews).set({
          status: 'success',
          extractedDomains: sql`${JSON.stringify((extractedInput.capabilities || []).map(a => a.name))}::jsonb` as any,
          architectureStyle: output.data.architectureStyle,
          topRisks: sql`${JSON.stringify(output.data.businessRisks.map(r => r.risk))}::jsonb` as any,
          blindSpots: sql`${JSON.stringify(output.data.domainBlindSpots || [])}::jsonb` as any,
          generationTimeMs: Date.now() - startTime,
          inputTokens: finalInputTokens,
          outputTokens: finalOutputTokens,
          totalCost: Number(finalTotalCost) || 0,
          unknownTechnologies: sql`${JSON.stringify(extractedInput.unknownTechnologies || [])}::jsonb` as any,
          missingNiches: sql`${JSON.stringify(extractedInput.missingNiches || [])}::jsonb` as any,
          confidenceScore: extractedInput.confidenceScore || 0,
          knowledgeVersion: 'v2.0.0', // Graph engine version
          graphSchemaVersion: 'v1.0',
          resolverVersion: 'v1.0',
          activatedNodes: output.telemetry ? sql`${JSON.stringify(output.telemetry.activatedNodes)}::jsonb` as any : null,
          suppressedNodes: output.telemetry ? sql`${JSON.stringify(output.telemetry.suppressedNodes)}::jsonb` as any : null,
          conflicts: output.telemetry ? sql`${JSON.stringify((output.telemetry as any).decisionRecords || [])}::jsonb` as any : null,
          insightPatches: output.telemetry ? sql`${JSON.stringify(output.telemetry.insightPatches || [])}::jsonb` as any : null,
          rawInput: isPrivate ? null : sql`${JSON.stringify({ ...extractedInput, brief: prompt })}::jsonb` as any,
          rawOutput: isPrivate ? null : sql`${JSON.stringify(output.data)}::jsonb` as any,
        }).where(eq(architectureReviews.id, recordId));
      }
      const { telemetry, ...clientOutput } = output as any;
      return { ...clientOutput, reviewId: isPrivate ? undefined : recordId || undefined };
    }

    const { telemetry, ...clientOutput } = output as any;
    return clientOutput;
  } catch (error: any) {
    // Log the full backend error server-side only. Never send raw
    // error/cause/code text to the client (e.g. DB offline, driver
    // messages) — the UI must only ever see a friendly message.
    console.error('Error processing architecture request:', error);

    // Extract the real underlying database error cause if it's a Drizzle error
    // (server-side only: persisted to the reviews table for internal debugging).
    let errorMessage = error instanceof Error ? error.message : String(error);
    if (error.cause && error.cause.message) {
      errorMessage = `${errorMessage} (Cause: ${error.cause.message})`;
    } else if (error.code) {
      errorMessage = `${errorMessage} (Code: ${error.code})`;
    }

    const generationTimeMs = Date.now() - startTime;

    if (recordId) {
      await db.update(architectureReviews).set({
        status: 'error',
        errorMessage: errorMessage,
        generationTimeMs,
      }).where(eq(architectureReviews.id, recordId)).catch(e => console.error("Failed to update error in DB:", e));
    } else {
      await db.insert(architectureReviews).values([{
        status: 'error',
        errorMessage: errorMessage,
        generationTimeMs,
      }]).catch(e => console.error("Failed to log error to DB:", e));
    }

    // Catch rate limit errors from Gemini API
    if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
      return {
        status: 'error',
        message: 'Wow, we are getting a lot of traffic right now! The engine is taking a quick breather. Please try again in 10 seconds.'
      };
    }

    // Generic, user-friendly fallback. The detailed errorMessage above is
    // already logged server-side and persisted for internal debugging —
    // never expose backend internals (DB status, drivers, stack text) here.
    return { status: 'error', message: 'Something went wrong while running your review. Please try again in a moment.' };
  }
}

export async function getReviewInputById(id: string) {
  try {
    const result = await db.select({ rawInput: architectureReviews.rawInput })
      .from(architectureReviews)
      .where(eq(architectureReviews.id, id))
      .limit(1);

    if (result.length > 0 && result[0].rawInput) {
      const parsedInput = result[0].rawInput as any;
      return parsedInput.brief || parsedInput.projectIdea || null;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch review input:", error);
    return null;
  }
}
