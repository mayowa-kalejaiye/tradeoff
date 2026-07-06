import { recommendArchitecture } from './src/engine/index';
import { ArchitectureInput } from './src/engine/types';

const hftInput: ArchitectureInput = {
  isValidRequest: true,
  projectIdea: "We are building a high-frequency trading execution engine for cryptocurrency arbitrage. The system must ingest real-time order book data from 15 different exchanges, run complex pricing algorithms, and execute trades within microseconds. Missing a trade window costs thousands of dollars. The system must never go down during market volatility spikes and needs to cryptographically log every decision for financial compliance audits. We have $10M in funding, 30 senior engineers, and performance is the absolute only thing that matters.",
  intent: "HFT Arbitrage Engine",
  industryContexts: ['fintech'],
  capabilities: [
    { id: 'ultra_low_latency', name: 'Ultra Low Latency', score: 99, source: 'llm', evidence: [] },
    { id: 'financial_critical', name: 'Financial Critical', score: 95, source: 'llm', evidence: [] },
    { id: 'relational_storage', name: 'Relational Storage', score: 80, source: 'llm', evidence: [] }
  ],
  teamScale: 'enterprise',
  teamSize: 30,
  expectedUsers: 100,
  scale: 'massive',
  criticality: 'financial_critical',
  latencyTolerance: 'ultra_low',
  offlineRequirements: 'none',
  budget: 'series_a',
  priority: 'speed',
  complianceLevel: 'soc2',
  technicalExperience: 'senior_engineer',
  unknownTechnologies: [],
  missingNiches: [],
  confidenceScore: 95
};

async function run() {
  const result = await recommendArchitecture(hftInput, hftInput.projectIdea);

  if (result.status !== 'success') {
    console.log('Failed');
    return;
  }

  console.log('--- ACTIVATED NODES ---');
  (result.data.decisionCards || []).forEach((n: any) => {
    console.log(`✅ ${n.recommendation} (${n.systemGroup})`);
  });

  console.log('\n--- SUPPRESSED NODES ---');
  const suppressedNodes = result.telemetry?.suppressedNodes || [];
  const suppressedIds = suppressedNodes.map((n: any) => n.id);
  console.log(`Suppressed Count: ${suppressedNodes.length}`);
  if (suppressedIds.includes('mqtt_broker')) {
    console.log('🔒 MQTT Broker successfully suppressed!');
  } else {
    console.log('❌ ERROR: MQTT Broker leaked through!');
  }

  if (suppressedIds.includes('stripe_connect')) {
    console.log('🔒 Stripe Connect successfully suppressed!');
  } else {
    console.log('❌ ERROR: Stripe Connect leaked through!');
  }

  if (suppressedIds.includes('meilisearch')) {
    console.log('🔒 Meilisearch successfully suppressed!');
  } else {
    console.log('❌ ERROR: Meilisearch leaked through!');
  }

  if (suppressedIds.includes('ros2')) {
    console.log('🔒 ROS2 successfully suppressed!');
  } else {
    console.log('❌ ERROR: ROS2 leaked through!');
  }
}
run();


