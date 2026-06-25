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
import { runEnhancers } from './enhancers';

function getBaseDomainResponse(input: ArchitectureInput): EngineResponse {
  // 1. Check for Absolute Vetoes (Internal Tools)
  if (input.archetypes.includes('internal_tool')) {
    const response = handleInternal(input);
    if (response) return response;
  }


  // Route to Fintech Expert Layer
  if (input.archetypes.includes('fintech')) {
    const response = handleFintech(input);
    if (response) return response;
  }

  // Route to Realtime Expert Layer
  if (input.archetypes.includes('realtime_collaboration')) {
    const response = handleRealtime(input);
    if (response) return response;
  }

  // Route to Social Expert Layer
  if (input.archetypes.includes('social_network')) {
    const response = handleSocial(input);
    if (response) return response;
  }

  // Route to Healthcare Expert Layer
  if (input.archetypes.includes('healthcare') || input.complianceLevel === 'hipaa') {
    const response = handleHealthcare(input);
    if (response) return response;
  }

  // Route to AI Coding Assistant Expert Layer
  if (input.archetypes.includes('ai_coding_assistant')) {
    const response = handleCodingAssistant(input);
    if (response) return response;
  }

  // Route to Web3/Crypto Expert Layer
  if (input.archetypes.includes('web3_dapp')) {
    const response = handleWeb3(input);
    if (response) return response;
  }

  // Route to IoT/Hardware Expert Layer
  if (input.archetypes.includes('iot_platform')) {
    const response = handleIoT(input);
    if (response) return response;
  }

  // Route to Developer Platform / PaaS Expert Layer
  if (input.archetypes.includes('paas')) {
    const response = handlePaaS(input);
    if (response) return response;
  }

  if (input.archetypes.includes('search_engine')) {
    const response = handleSearchEngine(input);
    if (response) return response;
  }

  if (input.archetypes.includes('recommendation_engine')) {
    const response = handleRecommendation(input);
    if (response) return response;
  }

  if (input.archetypes.includes('ad_tech')) {
    const response = handleAdTech(input);
    if (response) return response;
  }

  if (input.archetypes.includes('video_streaming')) {
    const response = handleStreaming(input);
    if (response) return response;
  }

  if (input.archetypes.includes('cybersecurity')) {
    const response = handleCybersecurity(input);
    if (response) return response;
  }

  if (input.archetypes.includes('ai_infrastructure')) {
    const response = handleAIInfra(input);
    if (response) return response;
  }

  if (input.archetypes.includes('gis_mapping')) {
    const response = handleGIS(input);
    if (response) return response;
  }

  if (input.archetypes.includes('messaging')) {
    const response = handleMessaging(input);
    if (response) return response;
  }

  if (input.archetypes.includes('ride_hailing')) {
    const response = handleRideHailing(input);
    if (response) return response;
  }

  if (input.archetypes.includes('ci_cd')) {
    const response = handleCICD(input);
    if (response) return response;
  }

  // Route to AI & Automation Expert Layer (Fallback for non-vertical AI)
  const aiResponse = handleAIAndAutomation(input);
  if (aiResponse) return aiResponse;

  // Fallback to Standard Expert Layer
  return handleDefault(input);
}

export function recommendArchitecture(input: ArchitectureInput): EngineResponse {
  const response = getBaseDomainResponse(input);
  
  if (response.status === 'success') {
    response.data = runEnhancers(input, response.data);
  }

  return response;
}
