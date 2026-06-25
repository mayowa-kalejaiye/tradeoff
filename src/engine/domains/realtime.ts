import { ArchitectureInput, EngineResponse } from '../types';

export function handleRealtime(input: ArchitectureInput): EngineResponse | null {
  const promptText = input.projectIdea.toLowerCase();
  
  // Principal Engineer Pushback
  const isMissingMetrics = input.expectedUsers > 10000 && (!input.userMetric || input.userMetric === 'unknown' || input.userMetric === 'registered');
  const mentionsSync = promptText.match(/(crdt|operational transformation|ot|websocket|pubsub|sync|yjs|automerge)/);

  if ((isMissingMetrics || !mentionsSync) && promptText.length < 100) {
    return {
      status: 'uncertainty',
      reason: 'Real-time collaboration architectures scale completely differently based on their conflict resolution strategy and concurrent connection volume.',
      questions: [
        'What is the expected peak concurrent user count? (Real-time scales by active sockets, not registered users)',
        'How are you handling concurrent edits? (CRDTs like Yjs, Operational Transformation, or simple Last-Write-Wins?)',
        'Does the real-time state need to be persisted permanently, or is it ephemeral (e.g., live cursors)?',
        'What happens when a user drops offline and reconnects 5 minutes later?'
      ]
    };
  }

  if (input.expectedUsers >= 100000 && input.userMetric === 'concurrent' && input.technicalExperience === 'senior_engineer') {
    return {
      status: 'success',
      data: {
        businessRisks: [
          { risk: 'User Churn from Latency', level: 'High', likelihood: 'Medium', reason: 'If the real-time sync lags, users will abandon the collaboration tool immediately.' }
        ],
        coreValidationQuestions: [
          'Can we simulate 100k concurrent WebSocket connections in a staging environment before launch?',
          'Do we strictly need a shared state (CRDTs) or just fire-and-forget events?'
        ],
        criticalUnknowns: [
          'The exact payload size per message which will dictate Redis memory exhaustion limits.'
        ],
        strategicAdvantages: [
          'Event-driven architecture decouples the heavy state-sync from traditional API requests.'
        ],
        domainConstraints: [
          'Real-time architectures require sticky sessions or intelligent routing.'
        ],
        architectureStyle: 'Event-driven Microservices (CQRS)',
        confidenceScores: {
          architecture: 95,
          patternSelection: 90,
          deployment: 85,
          cost: 75
        },
        confidenceBreakdown: {
          strongSignals: ['Traffic (>100k Concurrent)', 'Domain (Realtime)', 'Team (Senior)'],
          weakSignals: ['Payload Size per Message', 'Geographic Distribution of Users']
        },
        missingInformation: [],
        assumptions: [
          'Assumes message payloads are relatively small (JSON patches) rather than large files.'
        ],
        assumptionRisk: {
          level: 'Medium',
          reason: 'If payloads are large, Redis will bottleneck on memory. You would need to pivot to a Blob-Storage + Notification pattern.'
        },
        revisitWhen: [
          'Operational burden of deployment and monitoring consumes more than 20% of engineering time.'
        ],
        upgradePath: [],
        stack: [
          { name: 'Next.js', category: 'frontend' },
          { name: 'Go / Node.js (WebSockets)', category: 'backend' },
          { name: 'PostgreSQL', category: 'database' },
          { name: 'Redis (Pub/Sub)', category: 'cache' },
          { name: 'Kafka / RabbitMQ', category: 'queue' }
        ],
        deployment: ['AWS (EKS) or Google Cloud (GKE)'],
        recommended: [
          {
            name: 'Event-driven Microservices',
            reasons: [
              'Real-time collaboration at this scale demands independent scaling of socket servers vs API servers.',
              'Senior team has the capability to manage distributed system complexity.'
            ]
          }
        ],
        deferredDecisions: [
          {
            name: 'Modular Monolith',
            reason: 'Intentionally rejected. A monolith holding 100k+ concurrent WebSocket connections will suffer severe event-loop blocking and Garbage Collection pauses.'
          }
        ],
        architectureDebt: [
          {
            debt: 'Eventual Consistency Complexity',
            reason: 'Accepted intentionally. The system cannot guarantee that all users see the exact same state at the exact same millisecond.'
          }
        ],
        challenges: [
          { name: 'WebSocket Fanout', riskLevel: 'High', description: 'Broadcasting messages to 100k users requires sophisticated Redis Pub/Sub backplanes.' },
          { name: 'Event Ordering', riskLevel: 'Medium', description: 'Ensuring message A arrives before message B across distributed nodes.' }
        ],
        blueprint: [
          { category: 'Infrastructure', packages: ['kafkajs', 'ioredis', 'socket.io', 'yjs'] }
        ],
        operatingCostDrivers: [
          'EKS Cluster Base Cost (~$150/mo)',
          'Redis Memory footprint for 100k concurrent pub/sub connections',
          'Bandwidth egress costs for high-frequency small JSON packets'
        ]
      }
    };
  }

  return null;
}
