import { ExtractedCapability, IndustryContext, Priority, TechnicalExperience, UserMetric, TransactionVolume, ComplianceLevel } from '../types';

export type TeamSize = 'solo' | 'small' | 'medium' | 'enterprise';
export type Scale = 'mvp' | 'growth' | 'massive';
export type Criticality = 'low' | 'medium' | 'safety_critical' | 'financial_critical';
export type LatencyTolerance = 'high' | 'medium' | 'realtime' | 'ultra_low';
export type OfflineRequirements = 'none' | 'partial' | 'full';

export interface StartupModel {
  // Legacy / Transitional properties
  isValidRequest: boolean;
  projectIdea: string;
  intent: string;
  capabilities: ExtractedCapability[];
  industryContexts: IndustryContext[];
  expectedUsers: number;
  userMetric?: UserMetric;
  transactionVolume?: TransactionVolume;
  complianceLevel?: ComplianceLevel;
  priority: Priority;
  technicalExperience: TechnicalExperience;
  unknownTechnologies: string[];
  missingNiches: string[];
  confidenceScore: number;

  // New Engineering Decision Corpus properties
  teamScale: TeamSize;
  teamSize: number;
  runwayMonths?: number;
  scale: Scale;
  criticality: Criticality;
  latencyTolerance: LatencyTolerance;
  offlineRequirements: OfflineRequirements;
  budget: 'bootstrap' | 'seed' | 'series_a' | 'enterprise';
}
