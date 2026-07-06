export type IndustryContext = 
  | 'ecommerce' 
  | 'marketplace' 
  | 'saas' 
  | 'fintech' 
  | 'social_network' 
  | 'content_platform' 
  | 'realtime_collaboration' 
  | 'ai_saas' 
  | 'ai_coding_assistant'
  | 'internal_tool'
  | 'healthcare'
  | 'web3_dapp'
  | 'iot_platform'
  | 'paas'
  | 'search_engine'
  | 'recommendation_engine'
  | 'ad_tech'
  | 'video_streaming'
  | 'cybersecurity'
  | 'ai_infrastructure'
  | 'gis_mapping'
  | 'ride_hailing'
  | 'messaging'
  | 'ci_cd'
  | 'biotechnology'
  | 'robotics'
  | 'computer_vision'
  | 'safety_critical'
  | 'iot'
  | 'autonomous_vehicle'
  | 'other';

export interface ExtractedCapability {
  id: string;      // Namespaced: e.g., "messaging.reliable.robot"
  name: string;    // Legacy compat
  score: number;   // 0-100
  evidence: string[]; // Why this was activated
  source: 'llm' | 'deterministic';
}

export interface ScoringSignal {
  signal: string;
  contribution: number;
  evidence: string[];
}

export type Priority = 'speed' | 'scale' | 'cost' | 'reliability';
export type TechnicalExperience = 'vibe_coder' | 'developer' | 'senior_engineer';
export type UserMetric = 'registered' | 'mau' | 'concurrent' | 'unknown';
export type TransactionVolume = 'low' | 'medium' | 'high' | 'unknown';
export type ComplianceLevel = 'pci_dss' | 'hipaa' | 'soc2' | 'unknown';

import { StartupModel } from './models/startup';

export type ArchitectureInput = StartupModel;

export interface DecisionTrace {
  source: 'knowledge_card' | 'llm_insight' | 'knowledge_graph';
  patched: boolean;
  reason?: string;
  evidence?: string[];
  confidence?: number;
  knowledgeVersion: string;
}

export interface RecommendedItem {
  name: string;
  reasons: string[];
  trace?: DecisionTrace;
}

export interface RejectedItem {
  name: string;
  reason: string;
}

export interface StackComponent {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'cache' | 'queue' | 'ai' | 'other';
  systemGroup?: string;
  capability?: string;
  trace?: DecisionTrace;
}

// ─── Decision Intelligence Types ───

export interface DecisionCard {
  recommendation: string;
  capability?: string;
  systemGroup: string;
  evidence: string[];
  principles: string[];
  evidenceStrength: 'Strong' | 'Moderate' | 'Weak';
  stability: 'Very Stable' | 'Moderately Stable' | 'Fragile';
  
  // Tradeoff knowledge
  rationale: string;
  winsWhen: string[];
  losesWhen: string[];
  antiPatterns: string[];
  counterExamples: string[];
  migrationPath: string[]; 
  failureModes: { context: string; symptoms: string; detection: string; mitigation: string; recovery: string }[];
  scaleLimit?: { breaksFirst: string; observableSymptom: string; mitigations: string[] };
  alternatives: RejectedDecision[];
  
  knowledgeVersion: string;
  lineage?: {
    capability: string;
    constraint: string;
    intent: string;
  };
  engineeringComplexity?: 'High' | 'Medium' | 'Low';
  operationalCost?: 'High' | 'Medium' | 'Low';
}

export interface RejectedDecision {
  name: string;
  reason: string;
  capability: string;
  lostTo: string;
  winsWhen: string[];
}

export interface PressureMapEntry {
  dimension: string;
  pressure: number;
  influencedDecisions: string[];
}

export interface BlueprintCategory {
  category: 'Frontend' | 'Backend' | 'Database' | 'Authentication' | 'AI' | 'Infrastructure';
  packages: string[];
}

export interface DeferredDecision {
  name: string;
  reason: string;
}

export interface ArchitectureDebt {
  debt: string;
  reason: string;
}

export interface AssumptionRisk {
  level: 'High' | 'Medium' | 'Low';
  reason: string;
}

export interface ArchitectureChallenge {
  name: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  description: string;
}

export interface UpgradeStage {
  stage: string;
  trigger: string;
  description?: string;
}

export interface ConfidenceBreakdown {
  strongSignals: string[];
  weakSignals: string[];
}

export interface FailureMode {
  component: string;
  impact: string;
}

export interface BusinessRisk {
  risk: string;
  level: 'Critical' | 'High' | 'Medium';
  likelihood: 'High' | 'Medium' | 'Low';
  reason: string;
  trace?: DecisionTrace;
}

export interface ConfidenceScores {
  architecture: number;
  patternSelection: number;
  deployment: number;
  cost: number;
}

export interface ArchitectureOutput {
  businessRisks: BusinessRisk[];
  coreValidationQuestions: string[];
  criticalUnknowns: string[];
  strategicAdvantages: string[];
  domainConstraints: string[];
  architectureStyle: string;
  confidenceScores: ConfidenceScores;
  confidenceBreakdown: ConfidenceBreakdown;
  missingInformation: string[];
  assumptions: string[];
  assumptionRisk: AssumptionRisk;
  revisitWhen: string[];
  upgradePath: UpgradeStage[];
  stack: StackComponent[];
  deployment: string[];
  recommended: RecommendedItem[];
  deferredDecisions: DeferredDecision[];
  architectureDebt: ArchitectureDebt[];
  challenges: ArchitectureChallenge[];
  blueprint: BlueprintCategory[];
  operatingCostDrivers: string[];
  nonNegotiables?: string[];
  failureModes?: FailureMode[];
  domainBlindSpots?: string[];
  // Decision Intelligence
  decisionCards?: DecisionCard[];
  rejectedDecisions?: RejectedDecision[];
  pressureMap?: PressureMapEntry[];
}

export type EngineResponse = 
  | { status: 'success'; data: ArchitectureOutput; inputCapabilities?: { name: string; score: number; source: 'llm' | 'deterministic' }[]; reviewId?: string }
  | { status: 'uncertainty'; reason: string; questions: string[] }
  | { status: 'error'; message: string };
