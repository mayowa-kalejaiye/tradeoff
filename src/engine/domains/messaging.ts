import { ArchitectureInput, EngineResponse } from '../types';

export function handleMessaging(input: ArchitectureInput): EngineResponse | null {
  // Real-time systems pushback: ensuring they aren't using HTTP polling
  if (input.technicalExperience === 'vibe_coder') {
    return {
      status: 'uncertainty',
      reason: 'A true messaging platform (like WhatsApp/Discord) requires stateful connections, message delivery guarantees, and fan-out architectures. You cannot build this with standard REST APIs and polling.',
      questions: [
        'How do you guarantee message ordering and delivery if a user goes offline?',
        'Are you handling 1-to-1 chats, or massive groups/channels (Discord-style fan-out)?',
        'Do you require End-to-End Encryption (E2EE)?'
      ]
    };
  }

  return {
    status: 'success',
    data: {
      businessRisks: [
        {
          risk: 'Message Loss or Ordering Failures',
          level: 'Critical',
          likelihood: 'Medium',
          reason: 'If messages appear out of order or silently drop, users will immediately switch to WhatsApp or Slack.'
        },
        {
          risk: 'Fan-Out Amplification',
          level: 'High',
          likelihood: 'High',
          reason: 'If 1 user sends a message to a group of 10,000 users, that is 10,000 WebSocket broadcasts. Unoptimized fan-out will crash your brokers.'
        }
      ],
      domainConstraints: [
        'Stateful bi-directional connections (WebSockets / Server-Sent Events)',
        'Presence detection (Online/Offline status)',
        'Delivery guarantees (Sent, Delivered, Read receipts)',
        'Offline message synchronization'
      ],
      coreValidationQuestions: [
        'Can our Pub/Sub backplane handle 100k messages per second during a major event?',
        'How do we handle the "thundering herd" problem when 10k offline users reconnect simultaneously?'
      ],
      criticalUnknowns: [
        'What is the maximum group size limit?',
        'How long are we retaining chat history?'
      ],
      strategicAdvantages: [
        'Extreme user retention. Messaging creates the strongest network effects in software.'
      ],
      architectureStyle: 'Stateful WebSocket Gateways & Pub/Sub Routing',
      confidenceScores: { architecture: 95, patternSelection: 95, deployment: 85, cost: 70 },
      confidenceBreakdown: { strongSignals: ['Messaging Archetype'], weakSignals: [] },
      missingInformation: [],
      assumptions: ['Assuming chat history must be infinitely retained and searchable.'],
      assumptionRisk: { level: 'Medium', reason: 'Infinite retention will eventually require a migration from Postgres to Cassandra or ScyllaDB.' },
      revisitWhen: ['Database writes for individual messages exceed 10k TPS'],
      upgradePath: [
        { stage: 'Stage 1', description: 'Node.js/Socket.io + Redis Pub/Sub', trigger: 'MVP' },
        { stage: 'Stage 2', description: 'Go/Rust WebSockets + Kafka + ScyllaDB', trigger: '1M+ Concurrent Users' }
      ],
      stack: [
        { name: 'Go / Node.js (WebSocket Servers)', category: 'backend' },
        { name: 'Redis (Pub/Sub & Presence)', category: 'cache' },
        { name: 'PostgreSQL / ScyllaDB (Message Store)', category: 'database' },
        { name: 'Kafka (Message Broker)', category: 'queue' }
      ],
      deployment: ['AWS EKS or Bare Metal (for cheap bandwidth)'],
      recommended: [{ name: 'Separate Connection Nodes from Worker Nodes', reasons: ['WebSocket nodes should be extremely lightweight, doing nothing but holding connections and routing. Database writes must be handled asynchronously by workers.'] }],
      deferredDecisions: [{ name: 'E2E Encryption', reason: 'Implementing the Signal protocol is incredibly hard and breaks server-side search. Defer unless strictly required for privacy compliance.' }],
      architectureDebt: [{ debt: 'Single Redis instance for Pub/Sub', reason: 'Redis Pub/Sub sends every message to every node. You will need Redis Cluster or Kafka as fan-out scales.' }],
      challenges: [],
      blueprint: [
        { category: 'Infrastructure', packages: ['socket.io', 'ws'] },
        { category: 'Infrastructure', packages: ['kafka'] }
      ],
      operatingCostDrivers: ['Active WebSocket Connections (RAM)', 'High-volume Database Writes', 'Bandwidth Egress']
    }
  };
}
