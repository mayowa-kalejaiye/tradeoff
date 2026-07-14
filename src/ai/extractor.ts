import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { StartupModel } from '../engine/models/startup';
import { STANDARD_CAPABILITIES, STANDARD_INDUSTRY_CONTEXTS } from './ontology';

export interface ExtractionResult {
  input: StartupModel;
  usage: any;
}

const extractionSchema = z.object({
  isValidRequest: z.boolean().describe('True if the user is actually describing a software application/project to build. False if they are asking general questions like "what is your name", making small talk, or typing spam/gibberish.'),
  projectIdea: z.string().describe('A concise summary of what the user is trying to build. Leave empty if isValidRequest is false.'),
  intent: z.string().describe('The primary optimization target or business goal of the system (e.g. "Enterprise collaboration", "Low-latency trading", "Persistent communities").'),
  capabilities: z.array(z.object({
    name: z.string(),
    score: z.number().min(0).max(100).describe('Confidence score from 0 to 100 indicating how strongly the user needs this capability.')
  })).describe('The core software capabilities required by this project. Choose exact string matches from the provided ontology whenever possible.'),
  industryContexts: z.array(z.string()).describe('The industry verticals this project operates in. Choose exact string matches from the provided ontology whenever possible.'),
  teamScale: z.enum(['solo', 'small', 'medium', 'enterprise']).describe('The scale of the team building this. Solo = 1, Small = 2-10, Medium = 11-50, Enterprise = 50+'),
  teamSize: z.number().describe('The number of developers working on the project. Default to 1 if unknown or solo.'),
  runwayMonths: z.number().optional().describe('Estimated runway in months if mentioned. Empty if unknown.'),
  scale: z.enum(['mvp', 'growth', 'massive']).describe('Target scale. MVP = just launching, Growth = actively scaling users, Massive = Millions of users/enterprise scale.'),
  criticality: z.enum(['low', 'medium', 'safety_critical', 'financial_critical']).describe('Impact of failure. Does someone die (safety) or lose lots of money (financial)? Or is it just an inconvenience?'),
  latencyTolerance: z.enum(['high', 'medium', 'realtime', 'ultra_low']).describe('How fast does the system need to respond? E.g., batch jobs = high, standard web app = medium, chat = realtime, high-frequency trading / robotics = ultra_low.'),
  offlineRequirements: z.enum(['none', 'partial', 'full']).describe('Must the system function without internet? Full = completely isolated, Partial = syncs when online, None = always online.'),
  budget: z.enum(['bootstrap', 'seed', 'series_a', 'enterprise']).describe('Estimated budget level based on their description. Assume bootstrap if unknown/solo.'),
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

      CRITICAL: You must extract the underlying 'intent' (what they are optimizing for) and the required 'capabilities'.
      CRITICAL: You MUST select capabilities from the provided Standard Capability Ontology whenever possible. Do not invent generic capabilities like "realtime" or "communication" if a more precise ontology tag exists.
      
      --- STANDARD CAPABILITY ONTOLOGY ---
      ${STANDARD_CAPABILITIES.join('\n')}
      
      --- STANDARD INDUSTRY CONTEXTS ---
      ${STANDARD_INDUSTRY_CONTEXTS.join('\n')}

      CRITICAL: If they mention a user count (e.g. 300,000) but do NOT explicitly say if it is concurrent, MAU, or registered, you MUST set userMetric to "unknown". Do not guess.

      User Description:
      "${prompt}"
    `,
  });

  const finalInput = object as StartupModel;
  
  // Deterministic Keyword fallback
  const p = prompt.toLowerCase();
  const deterministicCaps: { name: string, score: number, source: 'llm'|'deterministic' }[] = [];
  
  if (p.includes('websocket') || p.includes('realtime') || p.includes('chat')) {
    deterministicCaps.push({ name: 'communication.realtime', score: 100, source: 'deterministic' });
  }
  if (p.includes('robot') || p.includes('agv') || p.includes('drone')) {
    deterministicCaps.push({ name: 'robotics.middleware', score: 100, source: 'deterministic' });
    deterministicCaps.push({ name: 'robotics.fleet_coordination', score: 100, source: 'deterministic' });
  }
  if (p.includes('offline') || p.includes('no internet')) {
    deterministicCaps.push({ name: 'data.sync.offline', score: 100, source: 'deterministic' });
  }
  
  const mergedCapabilities = [
    ...(finalInput.capabilities || []).map(c => ({ ...c, source: 'llm' as const })),
    ...deterministicCaps
  ];
  
  // Deduplicate
  const uniqueCaps = new Map();
  mergedCapabilities.forEach(c => uniqueCaps.set(c.name, c));
  finalInput.capabilities = Array.from(uniqueCaps.values());
  
  return { input: finalInput, usage };
}

