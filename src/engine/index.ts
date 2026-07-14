import { ArchitectureInput, EngineResponse } from './types';
import { handleFintech } from './domains/fintech';
import { handleRealtime } from './domains/realtime';
import { handleSocial } from './domains/social';
import { handleHealthcare } from './domains/healthcare';
import { handleInternal } from './domains/internal';
import { handleAIAndAutomation } from './domains/ai';
import { handleCodingAssistant } from './domains/coding_assistant';
import { handleWeb3 } from './domains/web3';
import { handleIoT } from './domains/iot';
import { handlePaaS } from './domains/paas';
import { handleSearchEngine } from './domains/search';
import { handleRecommendation } from './domains/recommendation';
import { handleAdTech } from './domains/adtech';
import { handleStreaming } from './domains/streaming';
import { handleCybersecurity } from './domains/cybersecurity';
import { handleAIInfra } from './domains/ai_infra';
import { handleGIS } from './domains/gis';
import { handleMessaging } from './domains/messaging';
import { handleRideHailing } from './domains/ride_hailing';
import { handleCICD } from './domains/ci_cd';
import { handleDefault } from './domains/default';
import { handleMarketplace } from './domains/marketplace';
import { handleBiotech } from './domains/biotech';
import { runEnhancers } from './enhancers';
import { extractOutputsOrPushback, mergeArchitectureOutputs } from './utils/compose';
import { KnowledgeProvider, KnowledgePack } from './knowledge/types';
import { JsonKnowledgeProvider } from './knowledge/jsonProvider';
import { CardKnowledgeProvider } from './knowledge/cardProvider';
import { marketplaceGraph } from './knowledge/cards/marketplace';
import { roboticsGraph } from './knowledge/cards/robotics';
import { computerVisionGraph } from './knowledge/cards/computer_vision';
import { safetyCriticalGraph } from './knowledge/cards/safety_critical';
import { fleetManagementGraph } from './knowledge/cards/fleet_management';
import { physicalSafetyGraph } from './knowledge/cards/physical_safety';
import { observabilityGraph } from './knowledge/cards/observability';
import { generateAdaptationPatches } from '../ai/patcher';
import { applyPatches } from '../ai/patcher/applier';
import { resolveGraph } from './knowledge/resolver';
import { StartupModel } from './models/startup';

export const KNOWLEDGE_VERSION = 'v2.0.0'; // Graph Engine
export const GRAPH_SCHEMA_VERSION = 'v1.0';
export const RESOLVER_VERSION = 'v1.0';

const domainHandlers: Partial<Record<string, KnowledgeProvider>> = {
  internal_tool: new JsonKnowledgeProvider(KNOWLEDGE_VERSION, handleInternal),
  fintech: new JsonKnowledgeProvider(KNOWLEDGE_VERSION, handleFintech),
  realtime_collaboration: new JsonKnowledgeProvider(KNOWLEDGE_VERSION, handleRealtime),
  social_network: new JsonKnowledgeProvider(KNOWLEDGE_VERSION, handleSocial),
  healthcare: new JsonKnowledgeProvider(KNOWLEDGE_VERSION, handleHealthcare),
  ai_coding_assistant: new JsonKnowledgeProvider(KNOWLEDGE_VERSION, handleCodingAssistant),
  web3_dapp: new JsonKnowledgeProvider(KNOWLEDGE_VERSION, handleWeb3),
  iot_platform: new JsonKnowledgeProvider(KNOWLEDGE_VERSION, handleIoT),
  paas: new JsonKnowledgeProvider(KNOWLEDGE_VERSION, handlePaaS),
  search_engine: new JsonKnowledgeProvider(KNOWLEDGE_VERSION, handleSearchEngine),
  recommendation_engine: new JsonKnowledgeProvider(KNOWLEDGE_VERSION, handleRecommendation),
  ad_tech: new JsonKnowledgeProvider(KNOWLEDGE_VERSION, handleAdTech),
  video_streaming: new JsonKnowledgeProvider(KNOWLEDGE_VERSION, handleStreaming),
  cybersecurity: new JsonKnowledgeProvider(KNOWLEDGE_VERSION, handleCybersecurity),
  ai_infrastructure: new JsonKnowledgeProvider(KNOWLEDGE_VERSION, handleAIInfra),
  gis_mapping: new JsonKnowledgeProvider(KNOWLEDGE_VERSION, handleGIS),
  messaging: new JsonKnowledgeProvider(KNOWLEDGE_VERSION, handleMessaging),
  ride_hailing: new JsonKnowledgeProvider(KNOWLEDGE_VERSION, handleRideHailing),
  ci_cd: new JsonKnowledgeProvider(KNOWLEDGE_VERSION, handleCICD),
  biotechnology: new JsonKnowledgeProvider(KNOWLEDGE_VERSION, handleBiotech)
};

// Graph registry
export const graphRegistry: Record<string, any> = {
  marketplace: marketplaceGraph,
  robotics: roboticsGraph,
  computer_vision: computerVisionGraph,
  safety_critical: safetyCriticalGraph,
  fleet_management: fleetManagementGraph,
  physical_safety: physicalSafetyGraph,
  observability: observabilityGraph
};

function getKnowledgePack(input: StartupModel): KnowledgePack | EngineResponse {
  // V5: We completely drop the legacy template veto system.
  // We return a blank knowledge pack, meaning the UI is driven 100% by the Decision Graph.
  return {
    version: KNOWLEDGE_VERSION,
    cards: [],
    legacyOutput: undefined
  };
}

export async function recommendArchitecture(input: StartupModel, rawPrompt: string): Promise<EngineResponse & { usage?: any, telemetry?: any }> {
  // 1. Check for legacy domain handlers
  const packOrResponse = getKnowledgePack(input);
  if ('status' in packOrResponse) return packOrResponse as EngineResponse;
  
  const knowledgePack = packOrResponse as KnowledgePack;

  // 2. Build the Active Graph
  // In V5, we merge ALL graphs. The resolver uses deterministic scoring 
  // to filter out irrelevant capabilities. This is the Engineering Operating System.
  const graphsToMerge = Object.values(graphRegistry);
  const domainScores: Record<string, number> = {};
  for (const cap of input.capabilities || []) {
    domainScores[cap.name] = cap.score;
  }

  // 3. Resolve the graph
  const { activeGraph, telemetry } = resolveGraph(graphsToMerge, input, domainScores);

  try {
    // 4. LLM Synthesis (Pass executive facts)
    const { adaptation, usage } = await generateAdaptationPatches(rawPrompt, input, telemetry.executiveFacts);
    
    // Track AI insights in telemetry
    telemetry.insightPatches = adaptation.insightPatches ? adaptation.insightPatches.map((p: any) => p.observation) : [];

    // 5. Apply Patches
    const finalOutput = applyPatches(input, knowledgePack, adaptation, activeGraph, telemetry);
    
    const enhancedData = runEnhancers(input, finalOutput);

    return { 
      status: 'success', 
      data: enhancedData, 
      inputCapabilities: input.capabilities, 
      usage,
      telemetry
    };
  } catch (error) {
    console.error("Failed to generate adaptation patches:", error);
    const fallbackData = knowledgePack.legacyOutput || applyPatches(input, knowledgePack, { knowledgePatches: [], insightPatches: [], executiveSummary: '' }, activeGraph, telemetry);
    return { status: 'success', data: runEnhancers(input, fallbackData), inputCapabilities: input.capabilities, telemetry };
  }
}
