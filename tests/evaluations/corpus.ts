import { EvaluationScenario } from './types';

export const benchmarkCorpus: EvaluationScenario[] = [
  {
    id: 'biotech-platform-001',
    name: 'Biotech Discovery Platform',
    category: 'standard',
    difficulty: 3,
    prompt: `We're building a BioTech platform that helps pharmaceutical companies and research institutions accelerate drug discovery using AI.
Researchers can upload genomic sequences, protein structures, microscopy images, laboratory notes, and experimental results. The platform uses vector search with Qdrant to semantically search research data, scientific papers, and previous experiments.
Long-running workflows such as sample processing, sequencing pipelines, experiment approvals, quality assurance, and laboratory automation are orchestrated with Temporal to guarantee reliable execution, retries, and workflow recovery.
The platform integrates with laboratory equipment, external sequencing providers, cloud HPC clusters, and electronic laboratory notebooks (ELNs).
The system stores highly sensitive scientific and patient-derived data and must comply with HIPAA, GDPR, and FDA 21 CFR Part 11.
Expected users: 25,000 researchers.
Team: 10 senior engineers.
Runway: 18 months.
Priority: reliability`,
    expected: {
      capabilities: [
        'ai.vector_search',
        'data.workflow_orchestration',
        'compliance.hipaa',
        'compliance.fda'
      ],
      industryContexts: ['biotechnology']
    },
    decisions: {
      required: [
        { arena: 'workflow_orchestration', winner: 'Temporal' },
        { arena: 'vector_database', winner: 'Qdrant' }
      ]
    }
  },
  {
    id: 'ai-coding-agent-001',
    name: 'AI Coding Agent SaaS',
    category: 'standard',
    difficulty: 4,
    failureClass: 'technology_leakage',
    prompt: `I'm building a platform where developers and teams can create, customize, and deploy AI coding agents for real software projects. Users can connect GitHub, upload documentation and files, collaborate in shared workspaces, and run agents that complete anything from quick tasks to long-running jobs. The product will support subscriptions, organizations, and role-based access. I'm starting with a small engineering team and want to keep costs low, but I need an architecture that can scale to millions of users without a major rewrite. Recommend the best system architecture, technology stack, infrastructure, database, communication patterns, caching, deployment strategy, and security approach. Explain every major decision, compare alternatives, justify your recommendations, and challenge any assumptions or design choices you think are weak.`,
    expected: {
      capabilities: [
        'ai.agent_orchestration',
        'communication.realtime',
        'data.source_control'
      ]
    },
    decisions: {
      required: [
        { arena: 'workflow_orchestration', winner: 'Temporal' },
        { arena: 'caching_strategy', winner: 'Redis' },
        { arena: 'realtime_communication', winner: 'WebSockets' }
      ],
      prohibited: [
        'Emergency Stop (E-Stop)',
        'MQTT Broker',
        'ROS2',
        'DDS'
      ]
    }
  },
  {
    id: 'adversarial-contradiction-001',
    name: 'Conflicting Constraints (Cheap + 5 Nines + Massive Scale)',
    category: 'adversarial',
    difficulty: 5,
    failureClass: 'conflicting_constraints',
    prompt: `We are building a global financial trading platform. It needs to handle 50 million active users with sub-millisecond latency for high-frequency trading. It must have 99.999% uptime and zero data loss in the event of a regional cloud outage. We are a team of 2 junior developers with a $500/month budget and we want to host it on a single VPS to save money.`,
    expected: {
      capabilities: [
        'data.transactional_integrity',
        'performance.ultra_low_latency'
      ],
      constraints: [
        'budget_seed',
        'team_junior'
      ]
    },
    decisions: {
      required: [
        // They asked for a single VPS, but the constraints dictate managed or distributed services for 5 nines + scale
        { arena: 'relational_database', winner: 'CockroachDB' } // or Spanner, but not SQLite on a VPS
      ]
    }
  },
  {
    id: 'enterprise-saas-001',
    name: 'Enterprise HR Platform',
    category: 'standard',
    difficulty: 3,
    prompt: `We are building a multi-tenant Enterprise HR SaaS platform. It must comply with strict data sovereignty rules in the EU, meaning some customers need their data stored in completely isolated database instances. For identity, we need open-source SAML SSO that we can host ourselves. We need to deploy using container orchestration across multiple clouds. Secrets management must be extremely secure with dynamic secrets generation. We also have a massive microservice architecture that needs high-throughput event streaming with durable replays for event sourcing. We are an enterprise team with a large budget.`,
    expected: {
      capabilities: [
        'security.identity',
        'security.secrets',
        'infrastructure.deployment',
        'communication.event_streaming',
        'data.multi_tenancy'
      ]
    },
    decisions: {
      required: [
        { arena: 'identity_management', winner: 'Keycloak' },
        { arena: 'secrets_management', winner: 'HashiCorp Vault' },
        { arena: 'compute_deployment', winner: 'Kubernetes' },
        { arena: 'event_streaming', winner: 'Apache Kafka' },
        { arena: 'tenant_isolation', winner: 'Database-per-tenant' }
      ],
      prohibited: [
        'Clerk', // B2C / Simple
        'Vercel', // PaaS, not multi-cloud containers
        'AWS SQS & SNS', // Multi-cloud requirement blocks this
        'Row-Level Security (Shared Database)' // Required isolated DBs
      ]
    }
  }
];
