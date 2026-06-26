import { ArchitectureInput, EngineResponse } from '../types';

export function handleMarketplace(input: ArchitectureInput): EngineResponse | null {
  if (!input.archetypes.some(a => a.name === 'marketplace')) return null;

  return {
    status: 'success',
    data: {
      businessRisks: [
        {
          risk: 'Fraud and Fake Listings',
          level: 'Critical',
          likelihood: 'High',
          reason: 'Marketplaces die quickly if users get scammed. Fake properties, duplicated images, and chargeback fraud are guaranteed issues at scale.'
        },
        {
          risk: 'Disintermediation (Platform Leakage)',
          level: 'High',
          likelihood: 'High',
          reason: 'Buyers and sellers often try to transact off-platform to avoid fees after discovering each other. You must provide enough ongoing value (e.g., escrow, verified status) to keep them on-platform.'
        }
      ],
      coreValidationQuestions: [
        'How will listings be verified before Kyren Agents exist?',
        'Who is allowed to create listings?',
        'How do you plan to handle payment escrow and chargebacks?'
      ],
      criticalUnknowns: [
        'The exact mechanism for resolving disputes between buyers and sellers.',
        'Whether payment routing involves complex split payments across multiple regions.'
      ],
      strategicAdvantages: [
        'Verified inventory creates a high-trust moat.',
        'Marketplace liquidity compounds over time; once you have the supply, demand follows automatically.',
        'Reviews and transaction history build a reputation graph that cannot be easily cloned.'
      ],
      domainConstraints: [
        'Strict identity verification (KYC/KYB) needed for high-value transactions.',
        'Extremely robust search and filtering capabilities required.',
        'Asymmetric supply/demand onboarding flows.'
      ],
      architectureStyle: 'Event-Driven Marketplace Architecture',
      confidenceScores: {
        architecture: 85,
        patternSelection: 80,
        deployment: 80,
        cost: 75
      },
      confidenceBreakdown: {
        strongSignals: [
          'Clear B2C marketplace model',
          'Defined supply and demand sides'
        ],
        weakSignals: [
          'Verification mechanisms during MVP are underspecified',
          'Dispute resolution flow is unclear'
        ]
      },
      missingInformation: [
        'Payment gateway integration details (Stripe Connect, PayPal, etc.)',
        'Image moderation strategy (manual vs AI)'
      ],
      assumptions: [
        'Payments will eventually be handled on-platform.'
      ],
      assumptionRisk: {
        level: 'High',
        reason: 'If payments are handled entirely off-platform, the entire financial reconciliation architecture changes.'
      },
      revisitWhen: [
        'Transaction volume reaches 10,000/month',
        'Fraud rates exceed 1% of GMV'
      ],
      upgradePath: [
        {
          stage: 'Phase 1: MVP',
          trigger: 'Launch',
          description: 'Monolith with basic search and manual moderation.'
        },
        {
          stage: 'Phase 2: Automated Trust & Safety',
          trigger: 'Manual moderation becomes bottleneck',
          description: 'Integrate automated image hashing to detect duplicate photos and AI models for spam detection.'
        }
      ],
      stack: [
        { name: 'Meilisearch / Elasticsearch', category: 'other' },
        { name: 'PostgreSQL', category: 'database' },
        { name: 'Cloudinary / S3', category: 'other' },
        { name: 'Stripe Connect', category: 'other' }
      ],
      deployment: [
        'Managed PostgreSQL (AWS RDS / Supabase)',
        'Vercel / Next.js for SSR SEO'
      ],
      recommended: [
        {
          name: 'Meilisearch or Typesense',
          reasons: ['Typo-tolerant, fast faceted search is critical for a marketplace.']
        },
        {
          name: 'Stripe Connect',
          reasons: ['Handles split payments, 1099 tax forms, and KYC compliance for sellers/landlords out of the box.']
        }
      ],
      deferredDecisions: [
        {
          name: 'In-house Image Moderation Models',
          reason: 'Use off-the-shelf APIs (AWS Rekognition or Cloudinary) for MVP.'
        }
      ],
      architectureDebt: [
        {
          debt: 'Vendor lock-in for payments',
          reason: 'Using Stripe Connect deeply couples you to their ecosystem, but building KYC/split payments yourself is commercial suicide for an MVP.'
        }
      ],
      challenges: [
        {
          name: 'Search Relevance Optimization',
          riskLevel: 'Medium',
          description: 'Balancing distance, price, ratings, and verified status in search results requires continuous tuning.'
        }
      ],
      blueprint: [
        {
          category: 'Infrastructure',
          packages: ['meilisearch', 'stripe']
        }
      ],
      operatingCostDrivers: [
        'Search index hosting and memory',
        'Image storage and bandwidth (CDN)',
        'Payment processing fees'
      ],
      domainBlindSpots: [
        'You are trying to build trust, not listings. People don\'t leave existing platforms because they lack listings. They leave because they don\'t trust the listings.'
      ]
    }
  };
}
