import { resolveGraph } from './src/engine/knowledge/resolver';
import { StartupModel } from './src/engine/models/startup';
import { graphRegistry } from './src/engine/index';

const aiCodingPlatformModel: StartupModel = {
  isValidRequest: true,
  projectIdea: 'AI Coding Agent platform',
  intent: 'collaboration',
  teamScale: 'small',
  teamSize: 5,
  scale: 'massive',
  criticality: 'medium',
  latencyTolerance: 'medium',
  offlineRequirements: 'none',
  budget: 'seed',
  expectedUsers: 1000000,
  priority: 'speed',
  technicalExperience: 'senior_engineer',
  capabilities: [
    { id: 'cap1', name: 'ai.agent_orchestration', score: 100, evidence: [], source: 'test' },
    { id: 'cap2', name: 'communication.realtime.browser', score: 95, evidence: [], source: 'test' },
    { id: 'cap3', name: 'data.source_control', score: 90, evidence: [], source: 'test' }
  ] as any[],
  unknownTechnologies: [],
  missingNiches: [],
  confidenceScore: 90,
  industryContexts: []
};

async function runTest() {
  const graphsToMerge = Object.values(graphRegistry);
  const domainScores: Record<string, number> = {};
  for (const cap of aiCodingPlatformModel.capabilities || []) {
    domainScores[cap.name] = cap.score;
  }
  const { activeGraph } = resolveGraph(graphsToMerge, aiCodingPlatformModel, domainScores);
  const nodeNames = activeGraph.map(n => n.name);
  console.log('--- SELECTED NODES ---');
  console.log(nodeNames.join('\n'));
  
  if (nodeNames.includes('Emergency Stop (E-Stop)') || nodeNames.includes('MQTT Broker')) {
    console.error('FAIL: Knowledge Graph Leakage detected!');
    process.exit(1);
  } else {
    console.log('PASS: No physical/robotics leakage detected.');
  }
}

runTest().catch(console.error);
