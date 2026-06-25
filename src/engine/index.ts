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
