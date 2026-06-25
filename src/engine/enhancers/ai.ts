import { ArchitectureInput, ArchitectureOutput } from '../types';

export function enhanceAI(input: ArchitectureInput, output: ArchitectureOutput): ArchitectureOutput {
  if (!input.projectIdea.toLowerCase().match(/(ai|llm|openai|anthropic|chatgpt|note generation|summarization|gpt)/)) {
    return output;
  }

  // If this is a healthcare app, inject HIPAA specific LLM risks
  const isHealthcare = input.archetypes.includes('healthcare') || input.complianceLevel === 'hipaa';

  if (isHealthcare) {
    output.domainConstraints.push(
      'Zero Data Retention (ZDR) BAA required with OpenAI/Anthropic',
      'Redacting PHI before it touches an LLM API',
      'Prompt retention and audit logging policies'
    );
    output.challenges.push({
      name: 'AI Hallucinated Medical Notes',
      riskLevel: 'High',
      description: 'The LLM might invent symptoms or omit critical warnings. You must enforce human-in-the-loop review before notes are saved to an EHR or patient record.'
    });
  } else {
    output.domainConstraints.push(
      'Prompt injection and jailbreak prevention', 
      'Cost control on token usage'
    );
    output.challenges.push({
      name: 'LLM Hallucinations & Latency',
      riskLevel: 'Medium',
      description: 'LLMs are non-deterministic and slow. Design UI fallbacks for timeouts and weird outputs.'
    });
  }

  output.stack.push({ name: 'OpenAI / Anthropic APIs', category: 'ai' });
  output.operatingCostDrivers.push('LLM Token usage (input/output/reasoning)');

  return output;
}
