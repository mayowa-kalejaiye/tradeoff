import { z } from 'zod';

export const KnowledgeUpdateSchema = z.object({
  targetNodeId: z.string().describe("The ID of the Node to update in the graph (e.g., 'database.relational.postgres')"),
  operation: z.enum(['add_anti_pattern', 'add_loses_when', 'add_scale_limit', 'add_incompatible_with']),
  value: z.string().describe("The new condition to add based on the feedback"),
  reason: z.string().describe("Why this update is being made")
});

export const FeedbackIngestionSchema = z.object({
  updates: z.array(KnowledgeUpdateSchema).describe("A list of explicit updates to the Deterministic Knowledge Graph based on the Principal Engineer's feedback.")
});

export type KnowledgeUpdate = z.infer<typeof KnowledgeUpdateSchema>;
export type FeedbackIngestion = z.infer<typeof FeedbackIngestionSchema>;
