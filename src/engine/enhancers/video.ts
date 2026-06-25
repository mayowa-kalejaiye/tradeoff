import { ArchitectureInput, ArchitectureOutput } from '../types';

export function enhanceVideo(input: ArchitectureInput, output: ArchitectureOutput): ArchitectureOutput {
  if (!input.projectIdea.toLowerCase().match(/(video|webrtc|agora|daily\.co|twilio|consultation)/)) {
    return output;
  }

  output.domainConstraints.push(
    'WebRTC reliability and fallbacks for poor networks (3G/4G)',
    'Recording storage, encryption, and retention costs'
  );

  output.challenges.push({
    name: 'Real-time Video Latency & Reliability',
    riskLevel: 'High',
    description: 'Building custom WebRTC infrastructure is a black hole of engineering time that will sink an MVP. You must buy a CPaaS solution.'
  });

  output.stack.push({ name: 'Daily.co / Twilio Video (CPaaS)', category: 'other' });
  output.operatingCostDrivers.push('Video bandwidth minutes (~$0.004/user/min)');

  return output;
}
