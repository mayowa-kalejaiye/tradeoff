import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { ArchitectureInput } from '../engine/types';

const extractionSchema = z.object({
  isValidRequest: z.boolean().describe('True if the user is actually describing a software application/project to build. False if they are asking general questions like "what is your name", making small talk, or typing spam/gibberish.'),
  projectIdea: z.string().describe('A concise summary of what the user is trying to build. Leave empty if isValidRequest is false.'),
  archetypes: z.array(z.enum([
    'ecommerce', 'marketplace', 'saas', 'fintech', 'social_network', 
    'content_platform', 'realtime_collaboration', 'ai_saas', 'internal_tool', 'other'
  ])).describe('The primary categories that best describe this project.'),
  teamSize: z.number().describe('The number of developers working on the project. Default to 1 if unknown or solo.'),
  expectedUsers: z.number().describe('The realistic expected number of users/MAU. Default to 1000 if not specified.'),
  userMetric: z.enum(['registered', 'mau', 'concurrent', 'unknown']).optional().describe('What kind of users are they describing? If they do not explicitly say "concurrent" or "MAU", return "unknown" so the engine can ask.'),
  transactionVolume: z.enum(['low', 'medium', 'high', 'unknown']).optional().describe('For fintech/ecommerce, what is the expected transaction volume? Default to unknown if not explicitly stated.'),
  complianceLevel: z.enum(['pci_dss', 'hipaa', 'soc2', 'unknown']).optional().describe('Specific regulatory compliance explicitly required? Example: Stripe -> pci_dss. Health app -> hipaa.'),
  priority: z.enum(['speed', 'scale', 'cost', 'reliability']).describe('The absolute highest priority for this architecture. "speed" = fast iteration/launch, "scale" = supporting massive traffic, "cost" = strict budget, "reliability" = strict uptime and data consistency (often for fintech).'),
  technicalExperience: z.enum(['vibe_coder', 'developer', 'senior_engineer']).describe('The technical sophistication of the builder. "vibe_coder" means heavily reliant on AI/no-code/Next.js, "developer" means standard mid-level, "senior_engineer" means capable of maintaining microservices/K8s/complex infrastructure. Default to "vibe_coder" if the prompt sounds inexperienced, otherwise "developer".')
});

export async function extractArchitectureInput(prompt: string): Promise<ArchitectureInput> {
  const { object } = await generateObject({
    model: google('gemini-2.5-flash'), // or gemini-2.5-pro if you prefer higher reasoning
    schema: extractionSchema,
    prompt: `
      You are an expert Staff Software Engineer. A user is describing a software project they want to build.
      Your job is to read their description and extract the core parameters needed to recommend an architecture.
      
      Read carefully between the lines. If they say "I don't know how to code but I'm building this with Claude", their technicalExperience is "vibe_coder".
      If they say "we are a team of 3 trying to launch an MVP this week", their priority is "speed".
      If they say "we're building Stripe", their archetype is "fintech" and priority is likely "reliability".

      CRITICAL: If they mention a user count (e.g. 300,000) but do NOT explicitly say if it is concurrent, MAU, or registered, you MUST set userMetric to "unknown". Do not guess.

      User Description:
      "${prompt}"
    `,
  });

  return object as ArchitectureInput;
}
