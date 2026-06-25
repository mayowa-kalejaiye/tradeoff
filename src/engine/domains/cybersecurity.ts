import { ArchitectureInput, EngineResponse } from '../types';

export function handleCybersecurity(input: ArchitectureInput): EngineResponse | null {
  if (input.technicalExperience === 'vibe_coder') {
    return {
      status: 'uncertainty',
      reason: 'Cybersecurity products (SIEM, EDR, SOC tools) require bulletproof systems engineering. You are handling extremely sensitive, high-volume event data that must be immutable and queryable in real-time.',
      questions: [
        'How do you handle sudden 100x spikes in event ingestion during an attack?',
        'How do you guarantee the immutability of audit logs?',
        'What is your complex event processing (CEP) engine for triggering alerts?'
      ]
    };
  }

  return {
    status: 'success',
    data: {
      businessRisks: [
        {
          risk: 'Dropped Events During Bursts',
          level: 'Critical',
          likelihood: 'Medium',
          reason: 'If your ingestion pipeline drops logs during a DDoS or breach, your product has failed its primary purpose. Security teams will never trust you again.'
        },
        {
          risk: 'Delayed Alerting',
          level: 'High',
          likelihood: 'High',
          reason: 'A detection rule that takes 15 minutes to run against batched data is useless for an active ransomware attack. You need streaming analytics.'
        }
      ],
      domainConstraints: [
        'Massive write-heavy ingestion (100k+ EPS)',
        'Immutable, append-only log storage',
        'Complex Event Processing (streaming window aggregations)',
        'Strict compliance and data residency controls'
      ],
      coreValidationQuestions: [
        'Can our ingestion pipeline absorb a 10x traffic spike without crashing?',
        'Can analysts query 30 days of logs in under 5 seconds?',
        'Is our alerting engine stateless and horizontally scalable?'
      ],
      criticalUnknowns: [
        'How quickly will storage costs scale when retaining 1 year of compliance data?',
        'Can we parse custom, malformed log formats on the fly?'
      ],
      strategicAdvantages: [
        'Extreme stickiness. Once a security team builds detection rules on your platform, migrating off takes years.'
      ],
      architectureStyle: 'Streaming Ingestion & Immutable Data Lake',
      confidenceScores: { architecture: 98, patternSelection: 95, deployment: 90, cost: 50 },
      confidenceBreakdown: { strongSignals: ['Cybersecurity Archetype'], weakSignals: [] },
      missingInformation: [],
      assumptions: ['Assuming compliance requires hot storage for 30 days, cold storage for 1 year.'],
      assumptionRisk: { level: 'Medium', reason: 'If compliance requires hot search across 1 year of data, Elasticsearch costs will explode.' },
      revisitWhen: ['Storage costs outpace revenue', 'Detection rules become too complex for simple streaming SQL'],
      upgradePath: [
        { stage: 'Stage 1', description: 'Kafka + Elasticsearch', trigger: 'MVP' },
        { stage: 'Stage 2', description: 'Kafka + ClickHouse + Tiered S3 Storage', trigger: 'Petabyte scale logs' }
      ],
      stack: [
        { name: 'Kafka / Redpanda', category: 'queue' },
        { name: 'ClickHouse / Elasticsearch', category: 'database' },
        { name: 'Flink / Spark Streaming', category: 'backend' },
        { name: 'Go (Log Shippers / Parsers)', category: 'backend' },
        { name: 'MinIO / S3 (Cold Storage)', category: 'database' }
      ],
      deployment: ['On-Premise / VPC Peering options', 'Strictly isolated multi-tenant K8s'],
      recommended: [{ name: 'Tiered Storage Architecture', reasons: ['Keep 7-30 days of logs in hot NVMe storage (ClickHouse), and push everything older to S3. Query S3 directly for compliance audits.'] }],
      deferredDecisions: [{ name: 'Machine Learning Anomaly Detection', reason: 'Start with deterministic Sigma rules and regex. ML creates too many false positives initially.' }],
      architectureDebt: [{ debt: 'Complex query syntax', reason: 'Exposing raw SQL/KQL to security analysts is necessary before building a drag-and-drop builder.' }],
      challenges: [],
      blueprint: [
        { category: 'Infrastructure', packages: ['kafka'] },
        { category: 'Database', packages: ['clickhouse', 'elasticsearch'] }
      ],
      operatingCostDrivers: ['Storage (Petabytes of logs)', 'Kafka compute and disk IOPS', 'Cross-AZ data transfer']
    }
  };
}
