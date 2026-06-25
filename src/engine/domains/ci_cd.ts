import { ArchitectureInput, EngineResponse } from '../types';
import { extractOutputsOrPushback, mergeArchitectureOutputs } from '../utils/compose';
import { handlePaaS } from './paas';

export function handleCICD(input: ArchitectureInput): EngineResponse | null {
  // Pushback specific to CI/CD
  if (input.technicalExperience === 'vibe_coder') {
    return {
      status: 'uncertainty',
      reason: 'A CI/CD platform executes untrusted code from thousands of developers simultaneously. Sandboxing, secret injection, and DAG execution are extremely difficult to get right.',
      questions: [
        'How do you plan to safely isolate build runners (e.g., VMs vs Containers)?',
        'How are you handling the Directed Acyclic Graph (DAG) of dependent build jobs?',
        'How will you securely inject and scrub secrets from build logs?'
      ]
    };
  }

  // Compose the foundational domain (PaaS handles Kubernetes, BuildKit, isolation)
  const paasOutput = handlePaaS(input);

  const { pushback, outputs } = extractOutputsOrPushback([paasOutput]);
  
  if (pushback) {
    return pushback; // If the PaaS layer thinks you can't handle K8s, it rejects the CI/CD request too.
  }

  const merged = mergeArchitectureOutputs(outputs);

  // Overlay CI/CD specifics
  merged.businessRisks.push({
    risk: 'Runner Compromise & Supply Chain Attacks',
    level: 'Critical',
    likelihood: 'High',
    reason: 'If a malicious PR can escape the build runner, it can steal secrets from other customers or compromise your infrastructure.'
  });

  merged.domainConstraints.push(
    'DAG (Directed Acyclic Graph) Execution Engine',
    'Artifact storage and caching (S3 / BuildKit caches)',
    'Secure secret management and log scrubbing',
    'Parallel job fan-out and collection'
  );

  merged.coreValidationQuestions.push(
    'Can our queue handle 10,000 jobs being triggered by a single monorepo push?',
    'Do secrets ever touch the disk in plain text?'
  );

  merged.criticalUnknowns.push('The ratio of cache hits to cache misses during builds, which drives CPU costs.');

  merged.architectureStyle = 'Distributed Job Execution Pipeline';

  merged.stack.push(
    { name: 'Temporal / Cadence (DAG Execution)', category: 'backend' },
    { name: 'S3 (Artifacts & Caches)', category: 'database' }
  );

  merged.recommended.push({
    name: 'Ephemeral Runners Only',
    reasons: ['Never reuse a build environment. Every job must start from a clean image or Firecracker microVM to prevent cross-contamination.']
  });

  return {
    status: 'success',
    data: merged
  };
}
