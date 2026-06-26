import { ArchitectureInput, ArchitectureOutput, EngineResponse, BusinessRisk, ArchitectureChallenge } from '../types';

export function handleFintech(input: ArchitectureInput): EngineResponse | null {
  const promptText = input.projectIdea.toLowerCase();
  
  // Principal Engineer Pushback
  const mentionsPCI = promptText.match(/(pci|credit card|stripe|plaid|payment gateway|tokenization)/);
  const mentionsCustody = promptText.match(/(ledger|custody|money transmitter|hold funds|wallet|balance)/);

  if (!mentionsPCI && !mentionsCustody && promptText.length < 100) {
    return {
      status: 'uncertainty',
      reason: 'Fintech architectures carry massive regulatory and financial liability. Recommending a stack without knowing your custody model is dangerous.',
      questions: [
        'Are you holding user funds directly (requiring a ledger and Money Transmitter License), or just integrating with a BaaS provider?',
        'Will your system touch raw credit card PANs (PCI-DSS Level 1 scope), or will you use third-party tokenization (e.g., Stripe Elements)?',
        'Do you require strict event-sourcing for compliance audits, or is standard relational durability enough?'
      ]
    };
  }

  // Delivery constraints vs Architectural Purity (The Outbox Pattern test)
  if (input.teamSize <= 3 && input.priority === 'reliability') {
    return {
      status: 'success',
      data: {
        architectureStyle: 'Modular Monolith (Outbox Pattern)',
        confidenceScores: {
          architecture: 85,
          patternSelection: 90,
          deployment: 95,
          cost: 80
        },
        confidenceBreakdown: {
          strongSignals: ['Team Size (Small)', 'Domain (Fintech)', 'Priority (Reliability)'],
          weakSignals: ['Exact Transaction Volume', 'Specific Regulatory Region']
        },
        missingInformation: [],
        assumptions: [
          'Assumes the MVP does not process millions of trades per second.',
          'Assumes standard PCI-DSS / SOC2 compliance is handled via tokenization (e.g. Stripe/Vanta).'
        ],
        assumptionRisk: {
          level: 'Medium',
          reason: 'If the tokenization provider goes down, your platform cannot process payments.'
        },
        revisitWhen: [
          'Team grows beyond 5 engineers and modular boundaries start blurring.',
          'Transaction volume forces independent scaling of the payment ledger.'
        ],
        upgradePath: [
          { stage: 'Stage 1: Separate Payment Processing Module', trigger: 'When payment code begins affecting core user management logic.' },
          { stage: 'Stage 2: Dedicated Ledger Service', trigger: 'When financial reporting queries slow down the main application.' },
          { stage: 'Stage 3: Event-Sourced Ledger', trigger: 'When required for strict, high-scale financial compliance audits.' }
        ],
        stack: [
          { name: 'Next.js (App Router)', category: 'frontend' },
          { name: 'PostgreSQL', category: 'database' },
          { name: 'Redis', category: 'cache' }
        ],
        deployment: ['Vercel', 'Neon (Serverless Postgres)'],
        recommended: [
          {
            name: 'Transactional Outbox Pattern',
            reasons: [
              'Guarantees at-least-once message delivery without full event sourcing overhead.',
              'Safely handles financial state changes using standard Postgres transactions.'
            ]
          },
          {
            name: 'Modular Monolith',
            reasons: [
              'Delivery constraints and team size outweigh architectural purity.',
              'Avoids the massive operational overhead of distributed microservices for a 3-person team.'
            ]
          }
        ],
        deferredDecisions: [
          {
            name: 'Event-Sourced Microservices (Kafka/Temporal)',
            reason: 'Intentionally deferred. Event sourcing will kill MVP velocity for a 3-person team. Delivery constraints outweigh architectural purity.'
          }
        ],
        architectureDebt: [
          {
            debt: 'Eventual Extraction Burden',
            reason: 'Accepted intentionally. Unpacking the Outbox pattern into proper event-sourcing later will be painful, but necessary to launch the MVP.'
          }
        ],
        challenges: [
          {
            name: 'Outbox Poller Latency',
            riskLevel: 'Medium',
            description: 'The outbox background worker may introduce slight delays in processing events compared to a native stream.'
          }
        ],
        businessRisks: [
          {
            risk: 'Regulatory Compliance Latency',
            level: 'Medium',
            likelihood: 'Low',
            reason: 'Operating a modular monolith may make auditors ask harder questions than a fully audit-trailed system.'
          }
        ],
        domainConstraints: ['Must handle ledger integrity within a single database transaction.'],
        coreValidationQuestions: [
          'Can we pass a basic compliance audit with our current data models?',
          'Are user funds verifiably secure in our MVP state?'
        ],
        criticalUnknowns: [
          'Will users trust a new brand with their banking credentials (Plaid)?',
          'Is our transaction volume actually going to require event-sourcing within year 1?'
        ],
        strategicAdvantages: [
          'High velocity: Small team can ship financial features without distributed systems overhead.',
          'Operational simplicity keeps hosting costs low during validation.'
        ],
        blueprint: [
          { category: 'Frontend', packages: ['next', 'react', 'react-dom'] },
          { category: 'Database', packages: ['pg', 'drizzle-orm'] }
        ],
        operatingCostDrivers: [
          'Relational database storage and IOPS (Fintech requires high durability)',
          'Background worker compute for outbox polling',
          'Third-party KYC/AML API usage',
          'Compliance monitoring tools (e.g. Vanta, Drata)'
        ],
        domainBlindSpots: [
          'Payment processing is not the difficult part. Reconciliation is.'
        ]
      }
    };
  }

  // Enterprise Fintech (The Stripe Test)
  if (input.technicalExperience === 'senior_engineer' && input.teamSize > 3) {
    return {
      status: 'success',
      data: {
        architectureStyle: 'Event-Sourced Microservices',
        confidenceScores: {
          architecture: 95,
          patternSelection: 95,
          deployment: 90,
          cost: 60
        },
        confidenceBreakdown: {
          strongSignals: ['Team Size (Large)', 'Domain (Enterprise Fintech)', 'Priority (Reliability)'],
          weakSignals: ['Deployment Geography (Multi-Region vs Single Region)']
        },
        missingInformation: [
          'Regulatory jurisdiction (e.g. GDPR, CCPA, local financial laws)',
          'Specific settlement models and third-party bank integrations'
        ],
        assumptions: [
          'Assumes PCI/SOC2 compliance is required on Day 1 for institutional partners.'
        ],
        assumptionRisk: {
          level: 'High',
          reason: 'Assuming you can offload all compliance to Stripe/Plaid is a common pitfall. You still need SOC2 for B2B.'
        },
        revisitWhen: ['Event store size makes replaying history prohibitively slow.'],
        upgradePath: [],
        stack: [
          { name: 'Java / Go / Node (Strict Types)', category: 'backend' },
          { name: 'PostgreSQL (Read Models)', category: 'database' },
          { name: 'Temporal.io', category: 'queue' },
          { name: 'Kafka (Event Store)', category: 'database' }
        ],
        deployment: ['AWS (EKS/RDS Multi-AZ)'],
        recommended: [
          {
            name: 'Event-Sourced Architecture',
            reasons: [
              'Fintech demands perfect auditability. Every state change must be an immutable event.',
              'Temporal.io provides distributed sagas to guarantee transaction completion across services.'
            ]
          }
        ],
        deferredDecisions: [
          {
            name: 'Standard CRUD Monolith',
            reason: 'Intentionally rejected. Data overwrites (UPDATE statements) destroy historical audit trails, making it impossible to pass financial compliance audits at this scale.'
          }
        ],
        architectureDebt: [
          {
            debt: 'High Operational Complexity',
            reason: 'Accepted intentionally. Maintaining a Kafka event store and Temporal workers requires dedicated SREs, but is the only way to guarantee auditability.'
          }
        ],
        challenges: [
          { name: 'Eventual Consistency', riskLevel: 'High', description: 'Read models will lag behind the event store. UIs must be built to handle optimistic updates gracefully.' },
          { name: 'Schema Evolution', riskLevel: 'High', description: 'Changing event payloads in the future requires complex upcasting logic.' }
        ],
        businessRisks: [
          {
            risk: 'Data Loss / Financial Discrepancy',
            level: 'Critical',
            likelihood: 'Medium',
            reason: 'At high scale, race conditions in a distributed system can cause dropped transactions or double-spends. This will destroy user trust immediately.'
          }
        ],
        domainConstraints: ['Strict requirement for immutable ledger records.', 'Compliance with financial audit trail regulations.'],
        coreValidationQuestions: [
          'Can our event-sourcing replay logic recover perfectly from a catastrophic outage?',
          'Is Temporal guaranteeing exactly-once processing for third-party bank settlements?'
        ],
        criticalUnknowns: [
          'Will regulators accept our schema evolution strategy for historical events?',
          'Can our core team realistically operate Kafka + Temporal without an SRE department?'
        ],
        strategicAdvantages: [
          'Perfect auditability unlocks enterprise B2B sales and top-tier regulatory approvals.',
          'Decoupled event streams allow massive scaling of individual financial products without blocking each other.'
        ],
        blueprint: [
          { category: 'Infrastructure', packages: ['@temporalio/client', 'kafkajs'] }
        ],
        operatingCostDrivers: [
          'Event store storage (Kafka/Redpanda) grows infinitely with transactions',
          'Temporal cluster compute and persistent state storage',
          'Enterprise multi-region database replication',
          'Dedicated SRE / DevSecOps headcount (often the largest cost)'
        ],
        domainBlindSpots: [
          'Payment processing is not the difficult part. Reconciliation is.'
        ]
      }
    };
  }

  return null; // Fallback to default
}
