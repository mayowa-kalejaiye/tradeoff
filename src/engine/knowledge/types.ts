import { ArchitectureInput, ArchitectureOutput } from "../types";

export interface KnowledgeCard {
  id: string;
  category: 'frontend' | 'backend' | 'database' | 'cache' | 'queue' | 'ai' | 'risk' | 'pattern' | 'constraint' | 'other';
  recommendation: string; // The display name
  rationale: string;
  appliesWhen?: string[];
  conflictsWith?: string[];
  dependsOn?: string[];
  alternativeTo?: string[];
  worksWellWith?: string[];
  introducedInVersion?: string;
}

export interface KnowledgePack {
  version: string;
  cards: KnowledgeCard[];
  // For domains not yet migrated to KnowledgeCards, we store the legacy output here
  legacyOutput?: ArchitectureOutput;
}

export interface KnowledgeProvider {
  getKnowledge(input: ArchitectureInput): KnowledgePack | null;
}
