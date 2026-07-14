export type FailureClass = 
  | 'implicit_capability'
  | 'conflicting_constraints'
  | 'technology_leakage'
  | 'scoring'
  | 'coverage';

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export interface ExpectedDecision {
  arena: string;
  winner: string;
}

export interface EvaluationScenario {
  id: string;
  name: string;
  category: 'standard' | 'adversarial' | 'edge-case';
  difficulty: DifficultyLevel;
  
  /** 
   * If this scenario historically failed, what type of failure was it? 
   * Useful for tracking improvements over time.
   */
  failureClass?: FailureClass;

  prompt: string;

  // ---------- Extraction Pipeline ----------
  expected: {
    capabilities: string[];
    constraints?: string[];
    industryContexts?: string[];
  };

  // ---------- Activation Pipeline ----------
  activation?: {
    shouldActivate?: string[];
    shouldSuppress?: string[];
  };

  // ---------- Decision Pipeline ----------
  decisions: {
    required: ExpectedDecision[];
    prohibited?: string[]; // Node IDs that MUST NOT be chosen under any circumstance
  };

  // ---------- Review ----------
  notes?: string;
}
