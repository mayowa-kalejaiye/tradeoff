import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { ArchitectureOutput } from '../../engine/types';
import { FeedbackIngestionSchema, FeedbackIngestion } from './schema';
import { sanitizeInput } from '../../utils/sanitize';

export async function ingestFeedback(
  rawFeedback: string,
  rejectedArchitecture: ArchitectureOutput
): Promise<{ updates: FeedbackIngestion; usage: any }> {

  // Sanitize the feedback to prevent LLM injection attacks
  const safeFeedback = sanitizeInput(rawFeedback);

  const systemPrompt = `
You are an Architecture Ontology Maintainer.
A Principal Engineer has reviewed a generated architecture and rejected a decision, providing critical feedback.
Your task is to analyze the feedback and the rejected architecture, and distill the feedback into explicit structural updates for the Deterministic Knowledge Graph.

The goal is CONTINUOUS LEARNING: The engine must never make this mistake again.

You must map the natural language feedback into structured patches:
- If a technology shouldn't be used at a certain scale, add a \`add_scale_limit\`.
- If a technology shouldn't be used in a specific context, add a \`add_loses_when\`.
- If a technology is a bad pattern overall for the given constraints, add a \`add_anti_pattern\`.
- If a technology clashes with another chosen technology, add an \`add_incompatible_with\`.

Feedback:
"""
${safeFeedback}
"""

Rejected Architecture Context:
${JSON.stringify({
  recommended: rejectedArchitecture.recommended,
  stack: rejectedArchitecture.stack.map(s => ({ id: s.name, category: s.category })),
  domainConstraints: rejectedArchitecture.domainConstraints
}, null, 2)}
`;

  const { object, usage } = await generateObject({
    model: google('gemini-2.5-flash'),
    schema: FeedbackIngestionSchema,
    prompt: systemPrompt,
  });

  return { updates: object, usage };
}
