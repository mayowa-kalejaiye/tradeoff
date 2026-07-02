import { StartupModel } from '../models/startup';

// ─── Decision Contexts: WHERE a decision lives ───
export enum DecisionContext {
  Messaging = 'Messaging',
  Storage = 'Storage',
  Compute = 'Compute',
  Deployment = 'Deployment',
  Identity = 'Identity',
  Observability = 'Observability',
  Navigation = 'Navigation',
  Search = 'Search',
  Telemetry = 'Telemetry',
  Payments = 'Payments',
  FleetOps = 'FleetOps',
  SafetyControl = 'SafetyControl',
}

// ─── Architecture Drivers: WHAT pressures influence decisions ───
export enum ArchitectureDriver {
  Reliability = 'Reliability',
  Latency = 'Latency',
  Cost = 'Cost',
  Compliance = 'Compliance',
  DeveloperVelocity = 'DeveloperVelocity',
  Scalability = 'Scalability',
  Availability = 'Availability',
  Safety = 'Safety',
  Security = 'Security',
  Maintainability = 'Maintainability',
}

// ─── System Groups: Capability-based grouping ───
export type SystemGroup =
  | 'edge_runtime'
  | 'cv_pipeline'
  | 'fleet_comms'
  | 'cloud_platform'
  | 'safety_systems'
  | 'observability'
  | 'compliance'
  | 'data_pipeline'
  | 'core';

// ─── Node Types ───
export type NodeType = 'Capability' | 'Implementation' | 'Constraint' | 'Risk';

// ─── Decision Kind: Facts vs Opinions ───
export type DecisionKind = 'fact' | 'rule' | 'judgment' | 'heuristic';

// ─── Recommendation Strength ───
export type RecommendationStrength = 'critical' | 'strongly_recommended' | 'recommended' | 'optional' | 'future';

// ─── Confidence ───
export type ConfidenceLevel = 'High' | 'Medium' | 'Low';

// ─── Structured Alternative ───
export interface AlternativeNode {
  id: string;
  reasonRejected: string;
  whenItWins?: string;
}

// ─── The Core Decision Node ───
export interface DecisionNode {
  id: string;
  type: NodeType;
  name: string;
  description: string;
  systemGroup: SystemGroup;
  capability?: string;
  kind: DecisionKind;
  strength: RecommendationStrength;

  // Tradeoff data (authored deterministically)
  gains?: string[];
  costs?: string[];
  alternatives?: AlternativeNode[];
  invalidWhen?: string[];

  // Graph scoring
  drivers: Partial<Record<ArchitectureDriver, number>>;
  authorities: Partial<Record<DecisionContext, number>>;
  score: (model: StartupModel) => number;
}

// ─── Edges ───
export type RelationshipStrength = 'mandatory' | 'optional' | 'exclusive';
export type RelationshipType = 'requires' | 'recommends' | 'replaces' | 'enhances' | 'blocks' | 'invalidates' | 'enables' | 'complements' | 'implementedBy';

export interface DecisionEdge {
  sourceId: string;
  targetId: string;
  type: RelationshipType;
  strength: RelationshipStrength;
}

// ─── The Graph ───
export interface DecisionGraph {
  nodes: Map<string, DecisionNode>;
  edges: DecisionEdge[];
}

// ─── Graph Metadata for Reproducibility ───
export interface DecisionGraphMetadata {
  graphVersion: string;
  resolverVersion: string;
  cardVersions: Record<string, string>;
}

// ════════════════════════════════════════════════════════════
// ─── V5 ENGINEERING TRADEOFF LIBRARY ───
// ════════════════════════════════════════════════════════════

export type V5NodeType = 'Capability' | 'Implementation' | 'Principle' | 'FailureMode';

export interface FailureMode {
  context: string;
  symptoms: string;
  detection: string;
  mitigation: string;
  recovery: string;
}

export interface AntiPattern {
  id: string;
  name: string;
  description: string;
  whyBad: string;
}

export interface ScaleLimit {
  breaksFirst: string;
  observableSymptom: string;
  mitigations: string[];
}

export interface SystemGroupMetadata {
  name: string;
  purpose: string;
  whyItExists: string;
  dependsOn: string[];
  feeds: string[];
}

export interface EngineeringPrinciple {
  id: string;
  statement: string;
}

// Global dictionary of principles
export const EngineeringPrinciples: Record<string, EngineeringPrinciple> = {
  locality_beats_latency: { id: 'locality_beats_latency', statement: 'Locality beats latency.' },
  move_compute_to_edge: { id: 'move_compute_to_edge', statement: 'Move computation to the edge when bandwidth dominates.' },
  prefer_deterministic: { id: 'prefer_deterministic', statement: 'Prefer deterministic behavior over peak throughput.' },
  offline_first: { id: 'offline_first', statement: 'Prefer protocols resilient to intermittent connectivity.' },
  // ... extensible
};

export interface ImplementationNode {
  id: string;
  type: 'Implementation';
  name: string;
  description: string;
  systemGroup: SystemGroup;
  
  engineeringComplexity: 'High' | 'Medium' | 'Low';
  operationalCost: 'High' | 'Medium' | 'Low';
  
  // Tradeoff knowledge
  winsWhen: string[];
  losesWhen: string[];
  antiPatterns: string[]; // references AntiPattern IDs
  counterExamples: string[];
  migrationPath: string[]; // e.g. ["MQTT", "Kafka", "Event Mesh"]
  failureModes: FailureMode[];
  scaleLimit?: ScaleLimit;
  
  // Dynamic stability triggers
  changesWhen: string[]; // e.g. ["fleet > 1M", "latency < 10ms"]
  
  // Referenced Principles
  principles: string[]; // array of principle IDs
  
  // Graph scoring (determinant of evidence strength)
  drivers: Partial<Record<ArchitectureDriver, number>>;
  capability: string; // The arena this implementation competes in
  score: (model: StartupModel) => number;
}

export interface DecisionArena {
  capability: string;
  candidates: ImplementationNode[];
}

export type ReasoningNode = ImplementationNode; // Simplified

export interface ReasoningGraph {
  nodes: Map<string, ReasoningNode>;
  edges: DecisionEdge[];
}
