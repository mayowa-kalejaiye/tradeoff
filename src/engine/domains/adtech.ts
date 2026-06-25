import { ArchitectureInput, EngineResponse } from '../types';

export function handleAdTech(input: ArchitectureInput): EngineResponse | null {
  if (input.priority !== 'speed' && input.priority !== 'reliability') {
    return {
      status: 'uncertainty',
      reason: 'AdTech and Demand-Side Platforms (DSPs) live and die by latency. Real-Time Bidding (RTB) auctions typically require responses within 50ms.',
      questions: [
        'Can your stack guarantee p99 latencies under 50ms?',
        'How are you handling high-throughput click tracking and attribution?',
        'What is your fraud detection strategy?'
      ]
    };
  }

  return {
    status: 'success',
    data: {
      businessRisks: [
        {
          risk: 'RTB Timeout Penalty',
          level: 'Critical',
          likelihood: 'High',
          reason: 'If your bidding engine takes longer than 50-100ms, the ad exchange drops your bid. You literally cannot make money if your infrastructure is slow.'
        },
        {
          risk: 'Click Fraud & Bot Traffic',
          level: 'High',
          likelihood: 'High',
          reason: 'Competitors and botnets will drain budget. You must identify and drop fraudulent clicks in real-time.'
        }
      ],
      domainConstraints: [
        'Strict p99 latency SLAs (< 50ms)',
        'Massive write-heavy workloads (event tracking)',
        'Budget pacing and distributed counters',
        'Complex attribution windows (first-touch, last-touch)'
      ],
      coreValidationQuestions: [
        'Is our edge routing fast enough to parse bid requests globally?',
        'Can our distributed cache handle millions of budget-decrement operations per second?',
        'Are our reporting queries running fast enough for advertisers?'
      ],
      criticalUnknowns: [
        'Will privacy changes (cookie deprecation, iOS ATT) break our attribution model?',
        'How do we handle delayed conversions across devices?'
      ],
      strategicAdvantages: [
        'High volume creates an immediate data moat.',
        'Extremely high margin if the auction algorithm is efficient.'
      ],
      architectureStyle: 'High-Throughput Edge Pipeline & OLAP Analytics',
      confidenceScores: { architecture: 95, patternSelection: 98, deployment: 90, cost: 40 },
      confidenceBreakdown: { strongSignals: ['Ad Tech Archetype'], weakSignals: [] },
      missingInformation: [],
      assumptions: ['Assuming global distribution of ad servers to minimize latency to exchanges.'],
      assumptionRisk: { level: 'High', reason: 'If edge servers fall out of sync with the central budget database, you will overspend advertiser money.' },
      revisitWhen: ['Write volume chokes the Kafka cluster', 'Advertisers demand real-time dashboard updates instead of batch'],
      upgradePath: [
        { stage: 'Stage 1', description: 'Go/Rust API + Redis + Postgres', trigger: 'MVP' },
        { stage: 'Stage 2', description: 'Aerospike + Kafka + ClickHouse', trigger: '10k+ QPS' }
      ],
      stack: [
        { name: 'Go / Rust', category: 'backend' },
        { name: 'Aerospike / ScyllaDB', category: 'cache' },
        { name: 'Kafka', category: 'queue' },
        { name: 'ClickHouse / Druid', category: 'database' },
        { name: 'Next.js (Advertiser Dashboard)', category: 'frontend' }
      ],
      deployment: ['Multi-region Bare Metal or Edge nodes', 'Managed OLAP'],
      recommended: [{ name: 'Separate Bidding from Reporting', reasons: ['The systems that bid on ads must be isolated from the systems that aggregate analytics data.'] }],
      deferredDecisions: [{ name: 'Deep Learning Bidding Models', reason: 'Start with simple heuristics. Complex ML adds latency.' }],
      architectureDebt: [{ debt: 'Eventual consistency on budget pacing', reason: 'Strict ACID transactions are too slow for RTB. You must accept minor budget overspill.' }],
      challenges: [],
      blueprint: [
        { category: 'Backend', packages: ['go', 'aerospike-client'] },
        { category: 'Database', packages: ['clickhouse'] }
      ],
      operatingCostDrivers: ['Massive network ingress/egress', 'High-performance NVMe storage for OLAP', 'Edge compute clusters']
    }
  };
}
