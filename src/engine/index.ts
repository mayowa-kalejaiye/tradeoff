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

const domainHandlers: Partial<Record<string, (input: ArchitectureInput) => EngineResponse | null>> = {
  internal_tool: handleInternal,
  fintech: handleFintech,
  realtime_collaboration: handleRealtime,
  social_network: handleSocial,
  healthcare: handleHealthcare,
  ai_coding_assistant: handleCodingAssistant,
  web3_dapp: handleWeb3,
  iot_platform: handleIoT,
  paas: handlePaaS,
  search_engine: handleSearchEngine,
  recommendation_engine: handleRecommendation,
  ad_tech: handleAdTech,
  video_streaming: handleStreaming,
  cybersecurity: handleCybersecurity,
  ai_infrastructure: handleAIInfra,
  gis_mapping: handleGIS,
  messaging: handleMessaging,
  ride_hailing: handleRideHailing,
  ci_cd: handleCICD,
  marketplace: handleMarketplace,
  biotechnology: handleBiotech
};

function getBaseDomainResponse(input: ArchitectureInput): EngineResponse {
  // Check for Absolute Vetoes first (e.g., Internal Tools might just need a basic CRUD return)
  if (input.archetypes.some(a => a.name === 'internal_tool')) {
    const response = handleInternal(input);
    if (response) return response;
  }

  // Sort archetypes by score descending, take top 3
  const topArchetypes = [...input.archetypes]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const responses: (EngineResponse | null)[] = [];

  for (const arch of topArchetypes) {
    const handler = domainHandlers[arch.name];
    if (handler) {
      const res = handler(input);
      if (res) responses.push(res);
    }
  }

  // Fallback if no specific domain handlers matched
  if (responses.length === 0) {
    const aiResponse = handleAIAndAutomation(input);
    if (aiResponse) {
      responses.push(aiResponse);
    } else {
      responses.push(handleDefault(input));
    }
  }

  const { pushback, outputs } = extractOutputsOrPushback(responses);
  if (pushback) return pushback; // If any domain pushed back with a question, return immediately

  if (outputs.length === 0) {
     return handleDefault(input);
  }

  const mergedOutput = mergeArchitectureOutputs(outputs);
  return { status: 'success', data: mergedOutput, inputArchetypes: input.archetypes };
}

export function recommendArchitecture(input: ArchitectureInput): EngineResponse {
  const response = getBaseDomainResponse(input);
  
  if (response.status === 'success') {
    response.data = runEnhancers(input, response.data);
  }

  return response;
}
