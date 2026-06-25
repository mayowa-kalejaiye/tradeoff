import { recommendArchitecture } from './src/engine';
import { ArchitectureInput } from './src/engine/types';

const input: ArchitectureInput = {
  projectIdea: 'Healthcare platform. Real-time video consultations. AI note generation. Need integration with Epic. Need integration with Cerner.',
  expectedUsers: 50000,
  teamSize: 2,
  priority: 'speed',
  archetypes: ['healthcare', 'ai_saas'],
  complianceLevel: 'hipaa'
};

const response = recommendArchitecture(input);
console.log(JSON.stringify(response, null, 2));
