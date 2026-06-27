import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { ArchitectureInput } from '../engine/types';

export interface ExtractionResult {
  input: ArchitectureInput;
  usage: any;
}

const extractionSchema = z.object({
  isValidRequest: z.boolean().describe('True if the user is actually describing a software application/project to build. False if they are asking general questions like "what is your name", making small talk, or typing spam/gibberish.'),
  projectIdea: z.string().describe('A concise summary of what the user is trying to build. Leave empty if isValidRequest is false.'),
  archetypes: z.array(z.object({
    name: z.enum([
      'ecommerce', 'marketplace', 'saas', 'fintech', 'social_network', 
      'content_platform', 'realtime_collaboration', 'ai_saas', 'ai_coding_assistant', 'internal_tool', 'healthcare', 'web3_dapp', 'iot_platform', 'paas', 'search_engine', 'recommendation_engine', 'ad_tech', 'video_streaming', 'cybersecurity', 'ai_infrastructure', 'gis_mapping', 'ride_hailing', 'messaging', 'ci_cd', 'other'
    ]),
    relevance: z.number().min(1).max(5).describe('Score from 1 to 5 indicating how central this archetype is to the project.')
  })).describe('The primary categories that best describe this project. A project can have multiple archetypes (e.g., a real estate app is both a marketplace and gis_mapping).'),
  teamSize: z.number().describe('The number of developers working on the project. Default to 1 if unknown or solo.'),
  expectedUsers: z.number().describe('The realistic expected number of users/MAU. Default to 1000 if not specified.'),
  userMetric: z.enum(['registered', 'mau', 'concurrent', 'unknown']).optional().describe('What kind of users are they describing? If they do not explicitly say "concurrent" or "MAU", return "unknown" so the engine can ask.'),
  transactionVolume: z.enum(['low', 'medium', 'high', 'unknown']).optional().describe('For fintech/ecommerce, what is the expected transaction volume? Default to unknown if not explicitly stated.'),
  complianceLevel: z.enum(['pci_dss', 'hipaa', 'soc2', 'unknown']).optional().describe('Specific regulatory compliance explicitly required? Example: Stripe -> pci_dss. Health app -> hipaa.'),
  priority: z.enum(['speed', 'scale', 'cost', 'reliability']).describe('The absolute highest priority for this architecture. "speed" = fast iteration/launch, "scale" = supporting massive traffic, "cost" = strict budget, "reliability" = strict uptime and data consistency (often for fintech).'),
  technicalExperience: z.enum(['vibe_coder', 'developer', 'senior_engineer']).describe('The technical sophistication of the builder. "vibe_coder" means heavily reliant on AI/no-code/Next.js, "developer" means standard mid-level, "senior_engineer" means capable of maintaining microservices/K8s/complex infrastructure. Default to "vibe_coder" if the prompt sounds inexperienced, otherwise "developer".'),
  unknownTechnologies: z.array(z.string()).describe('List of specific tools, frameworks, databases, or technologies the user explicitly asked for that you consider niche, obscure, cutting-edge, or rarely mapped in standard architectures (e.g., Temporal, Qdrant, Bun, Cloudflare Durable Objects). Leave empty if standard or none.'),
  missingNiches: z.array(z.string()).describe('List of specific industry niches the user explicitly mentioned that do not fit perfectly into the 25 standard archetypes (e.g., "LegalTech", "BioTech", "SpaceTech"). Leave empty if standard or none.'),
  confidenceScore: z.number().min(0).max(100).describe('Score from 0 to 100 representing how confident you are that you correctly understood the user\'s architectural needs based on their prompt. Drop this score if the prompt is vague, contradictory, or lacks detail.')
});

export async function extractArchitectureInput(prompt: string): Promise<ExtractionResult> {
  const { object, usage } = await generateObject({
    model: google('gemini-2.5-flash'), // or gemini-2.5-pro if you prefer higher reasoning
    schema: extractionSchema,
    prompt: `
      You are an expert Staff Software Engineer. A user is describing a software project they want to build.
      Your job is to read their description and extract the core parameters needed to recommend an architecture.
      
      Read carefully between the lines. If they say "I don't know how to code but I'm building this with Claude", their technicalExperience is "vibe_coder".
      If they say "we are a team of 3 trying to launch an MVP this week", their priority is "speed".

      CRITICAL: A project can fall into multiple archetypes. Assign a relevance score (1-5) to each applicable archetype.
      For example, a real estate app with maps should have 'marketplace' (5) and 'gis_mapping' (3).
      Do not just pick one. Provide all relevant archetypes.

      CRITICAL: If they mention a user count (e.g. 300,000) but do NOT explicitly say if it is concurrent, MAU, or registered, you MUST set userMetric to "unknown". Do not guess.

      User Description:
      "${prompt}"
    `,
  });

  return { input: object as ArchitectureInput, usage };
}
