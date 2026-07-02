import { z } from 'zod';

const EvidenceSchema = z.object({
  facts: z.array(z.string()).describe("Specific constraints extracted from the raw prompt (e.g. '1M devices', 'HIPAA compliant')")
});

export const KnowledgePatchSchema = z.object({
  targetNodeId: z.string().describe("The ID of the Knowledge Node from the active graph to adapt"),
  operation: z.enum(['adapt_rationale']),
  reason: z.string().describe("The modified rationale tailored specifically to the startup's constraints"),
  evidence: EvidenceSchema
});

export const InsightPatchSchema = z.object({
  section: z.enum(['businessRisks', 'criticalUnknowns', 'strategicAdvantages', 'domainConstraints']),
  operation: z.enum(['add']),
  observation: z.string().describe("The novel insight or observation to add"),
  reason: z.string().describe("Why this observation applies"),
  evidence: EvidenceSchema
});

export const ArchitectureAdaptationSchema = z.object({
  executiveSummary: z.string().describe("Polish the provided deterministic facts into a 2-3 sentence CTO-level summary. Explain WHY this architecture exists. Do NOT add new information."),
  knowledgePatches: z.array(KnowledgePatchSchema),
  insightPatches: z.array(InsightPatchSchema)
});

export type ArchitectureAdaptation = z.infer<typeof ArchitectureAdaptationSchema>;
export type KnowledgePatch = z.infer<typeof KnowledgePatchSchema>;
export type InsightPatch = z.infer<typeof InsightPatchSchema>;
