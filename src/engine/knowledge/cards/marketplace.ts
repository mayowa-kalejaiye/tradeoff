import { DecisionGraph, DecisionContext, ArchitectureDriver } from '../graph';

export const marketplaceGraph: DecisionGraph = {
  nodes: new Map([
    ['faceted_search', {
      id: 'faceted_search',
      type: 'Capability',
      name: 'Faceted Search',
      description: 'Typo-tolerant, fast faceted search is critical for a marketplace.',
      systemGroup: 'core',
      kind: 'heuristic',
      strength: 'strongly_recommended',
      gains: ['High conversion rates', 'Better user discovery'],
      costs: ['Search index maintenance'],
      drivers: {
        [ArchitectureDriver.DeveloperVelocity]: 0.8,
        [ArchitectureDriver.Latency]: 0.9
      },
      authorities: {
        [DecisionContext.Search]: 0.95
      },
      score: (model) => model.capabilities.some(d => d.name === 'marketplace') ? 95 : 0
    }],
    ['meilisearch', {
      id: 'meilisearch',
      type: 'Implementation',
      name: 'Meilisearch',
      description: 'Typo-tolerant search engine',
      systemGroup: 'core',
      capability: 'faceted_search',
      kind: 'judgment',
      strength: 'recommended',
      gains: ['Fast setup', 'Great typo tolerance'],
      costs: ['Self-hosting overhead if not using cloud'],
      alternatives: [
        { id: 'algolia', reasonRejected: 'Can be very expensive at scale.', whenItWins: 'When enterprise SLAs and extensive tooling are needed and budget is high.' },
        { id: 'elasticsearch', reasonRejected: 'Too complex to run for early stage.', whenItWins: 'Massive scale and complex aggregations.' }
      ],
      drivers: {
        [ArchitectureDriver.DeveloperVelocity]: 0.8,
        [ArchitectureDriver.Latency]: 0.9
      },
      authorities: {
        [DecisionContext.Search]: 0.80
      },
      score: (model) => model.budget === 'bootstrap' || model.teamScale === 'solo' ? 90 : 50
    }],
    ['split_payments', {
      id: 'split_payments',
      type: 'Capability',
      name: 'Split Payments & Escrow',
      description: 'Ability to hold funds and split payments between platform and providers.',
      systemGroup: 'core',
      kind: 'rule',
      strength: 'critical',
      gains: ['Trust between buyers and sellers'],
      costs: ['Complex regulatory requirements'],
      drivers: {
        [ArchitectureDriver.Compliance]: 0.9
      },
      authorities: {
        [DecisionContext.Payments]: 0.95
      },
      score: (model) => model.capabilities.some(d => d.name === 'marketplace') ? 95 : 0
    }],
    ['stripe_connect', {
      id: 'stripe_connect',
      type: 'Implementation',
      name: 'Stripe Connect',
      description: 'Handles split payments, 1099 tax forms, and KYC compliance for sellers.',
      systemGroup: 'compliance',
      capability: 'split_payments',
      kind: 'rule',
      strength: 'critical',
      gains: ['Offloads complex compliance (KYC, 1099s)', 'Handles international payouts'],
      costs: ['High platform fees', 'Vendor lock-in'],
      alternatives: [
        { id: 'adyen', reasonRejected: 'High barrier to entry', whenItWins: 'Enterprise scale multi-region platforms' }
      ],
      drivers: {
        [ArchitectureDriver.Compliance]: 0.95,
        [ArchitectureDriver.DeveloperVelocity]: 0.8
      },
      authorities: {
        [DecisionContext.Payments]: 0.90
      },
      score: (model) => model.capabilities.some(d => d.name === 'marketplace') ? 95 : 0
    }],
    ['postgres', {
      id: 'postgres',
      type: 'Implementation',
      name: 'PostgreSQL',
      description: 'ACID compliance is strictly required for financial transactions and inventory management.',
      systemGroup: 'cloud_platform',
      capability: 'relational_storage',
      kind: 'rule',
      strength: 'strongly_recommended',
      gains: ['ACID guarantees', 'Relational integrity for complex marketplace data'],
      costs: ['Scaling connections can be tricky'],
      alternatives: [
        { id: 'mongodb', reasonRejected: 'No schema enforcement out of the box, risky for financial data.', whenItWins: 'Heavy document processing or purely schemaless workflows.' }
      ],
      drivers: {
        [ArchitectureDriver.Reliability]: 0.95,
        [ArchitectureDriver.Security]: 0.8
      },
      authorities: {
        [DecisionContext.Storage]: 0.95
      },
      score: (model) => model.criticality === 'financial_critical' || model.capabilities.some(d => d.name === 'marketplace') ? 95 : 50
    }],
    ['relational_storage', {
      id: 'relational_storage',
      type: 'Capability',
      name: 'Relational Storage',
      description: 'Storage for structured, relational data with ACID guarantees.',
      systemGroup: 'cloud_platform',
      kind: 'rule',
      strength: 'critical',
      gains: ['Data integrity'],
      costs: ['Schema migrations'],
      drivers: {
        [ArchitectureDriver.Reliability]: 0.9
      },
      authorities: {
        [DecisionContext.Storage]: 1.0
      },
      score: (model) => 100
    }],
    ['risk_fraud', {
      id: 'risk_fraud',
      type: 'Risk',
      name: 'Fraud and Fake Listings',
      description: 'Marketplaces die quickly if users get scammed. Fake properties, duplicated images, and chargeback fraud are guaranteed issues at scale.',
      systemGroup: 'safety_systems',
      kind: 'fact',
      strength: 'critical',
      gains: [],
      costs: ['High operational overhead for manual review'],
      drivers: {
        [ArchitectureDriver.Security]: 0.9,
        [ArchitectureDriver.Safety]: 0.85
      },
      authorities: {
        [DecisionContext.SafetyControl]: 0.85
      },
      score: (model) => model.capabilities.some(d => d.name === 'marketplace') ? 100 : 0
    }],
    ['risk_disintermediation', {
      id: 'risk_disintermediation',
      type: 'Risk',
      name: 'Disintermediation (Platform Leakage)',
      description: 'Buyers and sellers often try to transact off-platform to avoid fees after discovering each other.',
      systemGroup: 'core',
      kind: 'heuristic',
      strength: 'strongly_recommended',
      gains: [],
      costs: ['Revenue loss'],
      drivers: {
        [ArchitectureDriver.Maintainability]: 0.5
      },
      authorities: {
        [DecisionContext.SafetyControl]: 0.80
      },
      score: (model) => model.capabilities.some(d => d.name === 'marketplace') ? 100 : 0
    }],
    ['constraint_kyc', {
      id: 'constraint_kyc',
      type: 'Constraint',
      name: 'Identity Verification',
      description: 'Strict identity verification (KYC/KYB) needed for high-value transactions.',
      systemGroup: 'compliance',
      kind: 'rule',
      strength: 'critical',
      gains: ['Regulatory compliance', 'Reduced fraud'],
      costs: ['User drop-off during onboarding'],
      drivers: {
        [ArchitectureDriver.Compliance]: 0.95
      },
      authorities: {
        [DecisionContext.Identity]: 0.85
      },
      score: (model) => model.criticality === 'financial_critical' || model.capabilities.some(d => d.name === 'marketplace') ? 90 : 0
    }]
  ]),
  edges: [
    {
      sourceId: 'faceted_search',
      targetId: 'meilisearch',
      type: 'implementedBy',
      strength: 'optional'
    },
    {
      sourceId: 'split_payments',
      targetId: 'stripe_connect',
      type: 'implementedBy',
      strength: 'optional'
    },
    {
      sourceId: 'relational_storage',
      targetId: 'postgres',
      type: 'implementedBy',
      strength: 'optional'
    },
    {
      sourceId: 'constraint_kyc',
      targetId: 'stripe_connect',
      type: 'implementedBy',
      strength: 'optional'
    }
  ]
};
