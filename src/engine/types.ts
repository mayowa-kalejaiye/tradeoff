export type ProjectArchetype = 
  | 'ecommerce' 
  | 'marketplace' 
  | 'saas' 
  | 'fintech' 
  | 'social_network' 
  | 'content_platform' 
  | 'realtime_collaboration' 
  | 'ai_saas' 
  | 'internal_tool'
  | 'healthcare'
  | 'other';

export type Priority = 'speed' | 'scale' | 'cost' | 'reliability';
export type TechnicalExperience = 'vibe_coder' | 'developer' | 'senior_engineer';
export type UserMetric = 'registered' | 'mau' | 'concurrent' | 'unknown';
export type TransactionVolume = 'low' | 'medium' | 'high' | 'unknown';
export type ComplianceLevel = 'pci_dss' | 'hipaa' | 'soc2' | 'unknown';

export interface ArchitectureInput {
  projectIdea: string;
  archetypes: ProjectArchetype[];
  teamSize: number;
  expectedUsers: number;
  userMetric?: UserMetric;
  transactionVolume?: TransactionVolume;
  complianceLevel?: ComplianceLevel;
  priority: Priority;
  technicalExperience: TechnicalExperience;
}

export interface RecommendedItem {
  name: string;
  reasons: string[];
}

export interface RejectedItem {
  name: string;
  reason: string;
}

export interface StackComponent {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'cache' | 'queue' | 'ai' | 'other';
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

export interface BusinessRisk {
  risk: string;
  level: 'Critical' | 'High' | 'Medium';
  likelihood: 'High' | 'Medium' | 'Low';
  reason: string;
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
}

export type EngineResponse = 
  | { status: 'success'; data: ArchitectureOutput }
  | { status: 'uncertainty'; reason: string; questions: string[] }
  | { status: 'error'; message: string };
