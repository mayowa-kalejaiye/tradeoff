import { ArchitectureOutput, EngineResponse } from '../types';

/**
 * Helper to deep merge multiple ArchitectureOutput objects into one cohesive output.
 * It concatenates arrays and deduplicates specific lists like stack components or blueprints.
 */
export function mergeArchitectureOutputs(outputs: ArchitectureOutput[]): ArchitectureOutput {
  if (outputs.length === 0) {
    throw new Error('mergeArchitectureOutputs requires at least one output');
  }

  if (outputs.length === 1) {
    return outputs[0];
  }

  const base = outputs[0];
  const rest = outputs.slice(1);

  // Deep clone the base to avoid mutating the original
  const merged: ArchitectureOutput = JSON.parse(JSON.stringify(base));

  for (const output of rest) {
    // Arrays to concatenate
    merged.businessRisks.push(...output.businessRisks);
    merged.coreValidationQuestions.push(...output.coreValidationQuestions);
    merged.criticalUnknowns.push(...output.criticalUnknowns);
    merged.strategicAdvantages.push(...output.strategicAdvantages);
    merged.domainConstraints.push(...output.domainConstraints);
    merged.missingInformation.push(...output.missingInformation);
    merged.assumptions.push(...output.assumptions);
    merged.revisitWhen.push(...output.revisitWhen);
    merged.upgradePath.push(...output.upgradePath);
    merged.deployment.push(...output.deployment);
    merged.recommended.push(...output.recommended);
    merged.deferredDecisions.push(...output.deferredDecisions);
    merged.architectureDebt.push(...output.architectureDebt);
    merged.challenges.push(...output.challenges);
    merged.operatingCostDrivers.push(...output.operatingCostDrivers);
    
    merged.confidenceBreakdown.strongSignals.push(...output.confidenceBreakdown.strongSignals);
    merged.confidenceBreakdown.weakSignals.push(...output.confidenceBreakdown.weakSignals);

    // Merge stack uniquely by name
    for (const stackComp of output.stack) {
      if (!merged.stack.find(s => s.name === stackComp.name)) {
        merged.stack.push(stackComp);
      }
    }

    // Merge blueprint uniquely by category + package
    for (const bp of output.blueprint) {
      let existingCategory = merged.blueprint.find(b => b.category === bp.category);
      if (existingCategory) {
        for (const pkg of bp.packages) {
          if (!existingCategory.packages.includes(pkg)) {
            existingCategory.packages.push(pkg);
          }
        }
      } else {
        merged.blueprint.push(bp);
      }
    }

    // Average confidence scores
    merged.confidenceScores.architecture = Math.floor((merged.confidenceScores.architecture + output.confidenceScores.architecture) / 2);
    merged.confidenceScores.patternSelection = Math.floor((merged.confidenceScores.patternSelection + output.confidenceScores.patternSelection) / 2);
    merged.confidenceScores.deployment = Math.floor((merged.confidenceScores.deployment + output.confidenceScores.deployment) / 2);
    merged.confidenceScores.cost = Math.floor((merged.confidenceScores.cost + output.confidenceScores.cost) / 2);

    // If any has a higher assumption risk, bump it up
    if (output.assumptionRisk.level === 'High' || merged.assumptionRisk.level === 'High') {
      merged.assumptionRisk.level = 'High';
    } else if (output.assumptionRisk.level === 'Medium' || merged.assumptionRisk.level === 'Medium') {
      merged.assumptionRisk.level = 'Medium';
    }
    
    if (output.assumptionRisk.reason) {
      merged.assumptionRisk.reason += ' | ' + output.assumptionRisk.reason;
    }
  }

  return merged;
}

/**
 * Resolves an array of engine responses. If any response is a pushback (uncertainty) or error, 
 * it immediately returns that pushback. Otherwise, it extracts the outputs.
 */
export function extractOutputsOrPushback(responses: (EngineResponse | null)[]): { pushback: EngineResponse | null, outputs: ArchitectureOutput[] } {
  const outputs: ArchitectureOutput[] = [];
  
  for (const res of responses) {
    if (!res) continue;
    if (res.status === 'uncertainty' || res.status === 'error') {
      return { pushback: res, outputs: [] };
    }
    if (res.status === 'success') {
      outputs.push(res.data);
    }
  }

  return { pushback: null, outputs };
}
