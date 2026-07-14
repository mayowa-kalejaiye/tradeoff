export interface ActivationTrace {
  anyOfSatisfied: { name: string; score: number }[];
  allOfSatisfied: { name: string; score: number }[];
}

export interface EvaluationTrace {
  baseScore: number;
  driverBonuses: { driver: string; bonus: number }[];
  capabilityBonuses: { capability: string; bonus: number }[];
  industryBonuses: { industry: string; bonus: number }[];
  finalScore: number;
}

export interface ExecutionTrace {
  candidateId: string;
  candidateName: string;
  activation: ActivationTrace;
  evaluation: EvaluationTrace;
  isWinner: boolean;
  arena: string; // The capability/system group arena it competed in
}

export interface SuppressedNode {
  id: string;
  name: string;
  reason: 'failed_eligibility' | 'failed_constraint' | 'missing_activation_capability' | 'lost_in_arena' | 'dropped_in_validation';
  failedEligibility?: { type: 'anyOf' | 'allOf' | 'noneOf'; details: string[] };
  failedConstraint?: string;
  missingCapabilities?: string[];
  confidence: number;
  evidence: string[];
}

export interface ValidationTrace {
  iteration: number;
  action: 'synthesized_dependency' | 'resolved_conflict' | 'pruned_superseded';
  nodeId: string;
  reason: string;
}

export interface EngineValidationTrace {
  executionTraces: ExecutionTrace[];
  suppressedNodes: SuppressedNode[];
  validationTraces?: ValidationTrace[];
}
