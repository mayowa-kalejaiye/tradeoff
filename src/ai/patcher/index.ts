import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { StartupModel } from '../../engine/models/startup';
import { ExecutiveFacts } from '../../engine/knowledge/resolver';
import { ArchitectureAdaptationSchema, ArchitectureAdaptation } from './schema';

export async function generateAdaptationPatches(
  rawPrompt: string,
  constraints: StartupModel,
  executiveFacts: ExecutiveFacts
): Promise<{ adaptation: ArchitectureAdaptation; usage: any }> {

  const systemPrompt = `
You are a world-class Principal Software Engineer reviewing a proposed architecture for a startup.
The Deterministic Architecture Engine has already analyzed the startup constraints and built a mathematically sound "Resolved Decision Graph".
Your task is NOT to suggest new technologies, but to critique the generated architecture. 
You must synthesize the deterministic facts into an executive summary, adapt the rationale of nodes, and most importantly, provide a hard, senior-level critique pointing out the biggest systemic risk or operational burden of the chosen stack.

You MAY:
✓ Polish the deterministic facts into a cohesive executive summary.
✓ Provide a brutal, honest Principal Critique of the operational tradeoffs of the architecture.
✓ Adapt the rationale of existing nodes to sound cohesive.
✓ Add novel Business Risks or Domain Constraints specific to their niche.

You MAY NOT:
✗ Invent or add architectural Implementation nodes.
✗ Add information to the executive summary that is not present in the facts.

Raw Prompt:
"""
${rawPrompt}
"""

Startup Model (Extracted Constraints):
${JSON.stringify(constraints, null, 2)}

Executive Facts (Deterministic - Polish these into the summary):
${JSON.stringify(executiveFacts, null, 2)}
`;

  const { object, usage } = await generateObject({
    model: google('gemini-2.5-flash'),
    schema: ArchitectureAdaptationSchema,
    prompt: systemPrompt,
  });

  return { adaptation: object, usage };
}
