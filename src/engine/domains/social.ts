import { ArchitectureInput, EngineResponse } from '../types';

export function handleSocial(input: ArchitectureInput): EngineResponse | null {
  // The Premature Scaling Trap
  if (input.expectedUsers > 1000000 && input.teamSize <= 3 && input.priority === 'speed') {
    return {
      status: 'success',
      data: {
        businessRisks: [
          { risk: 'Running out of runway before product-market fit', level: 'Critical', likelihood: 'High', reason: 'Over-engineering social features takes months. You have limited runway.' }
        ],
        coreValidationQuestions: [
          'Can we validate the core social loop (create post -> view feed) manually before writing code?',
          'Will users actually invite their friends to this network?'
        ],
        criticalUnknowns: [
          'The ultimate read/write ratio for the news feed once real users join.'
        ],
        strategicAdvantages: [
          'BaaS allows shipping a functional MVP in weeks, maximizing runway for iteration.'
        ],
        domainConstraints: [
          'Social networks require low-latency media delivery and high-availability feeds.'
        ],
        architectureStyle: 'Lean MVP (BaaS)',
        confidenceScores: {
          architecture: 95,
          patternSelection: 95,
          deployment: 90,
          cost: 85
        },
        confidenceBreakdown: {
          strongSignals: ['Team Size (Small)', 'Delivery Priority (Speed)', 'Premature Scale Trap Detected'],
          weakSignals: ['Exact feature set', 'Founding team runway']
        },
        missingInformation: [
          'Expected media storage volume (images/videos)',
          'Read/Write ratio for the news feed'
        ],
        assumptions: [
          'Assumes your 2-person team has no dedicated DevOps/Infra engineer.',
          'Assumes survival and initial user acquisition is more important than pure unit economics.'
        ],
        assumptionRisk: {
          level: 'Low',
          reason: 'BaaS minimizes execution risk for small teams. The risk is deferred until you scale.'
        },
        revisitWhen: [
          'Acquisition actually succeeds and hits 10k concurrent active users.',
          'Database costs for the feed start exceeding $1000/mo.'
        ],
        upgradePath: [
          { stage: 'Stage 1: Read-Heavy Redis Cache', trigger: 'When feed load times exceed 500ms for 10% of users.' },
          { stage: 'Stage 2: Dedicated Video/Media Processing', trigger: 'When user-generated video uploads slow down the main API.' },
          { stage: 'Stage 3: Event-Driven Feed Materialization', trigger: 'At 1M MAU, when standard SQL queries for feeds become impossible.' }
        ],
        stack: [
          { name: 'Next.js (App Router)', category: 'frontend' },
          { name: 'Supabase', category: 'database' },
          { name: 'Vercel Blob / S3', category: 'other' }
        ],
        deployment: ['Vercel', 'Supabase Cloud'],
        recommended: [
          {
            name: 'Supabase (BaaS)',
            reasons: [
              'You are optimizing for the wrong thing. You do not have 10 million users. You have zero users.',
              'Build for acquisition first. A BaaS lets a 2-person team iterate instantly without managing databases.'
            ]
          }
        ],
        deferredDecisions: [
          {
            name: 'Kubernetes / Microservices / Kafka',
            reason: 'Intentionally deferred. Premature Optimization Trap. Optimizing for 10 million users on Day 1 will guarantee you miss your MVP deadline and run out of funding.'
          }
        ],
        architectureDebt: [
          {
            debt: 'Severe Vendor Lock-in',
            reason: 'Chosen intentionally to maximize delivery speed and survive the first year without dedicated DevOps.'
          },
          {
            debt: 'Higher unit economics at scale',
            reason: 'BaaS platforms charge premiums for bandwidth. This debt is accepted because survival is more important than margin optimization right now.'
          }
        ],
        challenges: [
          {
            name: 'Vendor Lock-in',
            riskLevel: 'Medium',
            description: 'Supabase Postgres features (like Row Level Security) make moving off the platform later more difficult, but this is a trade-off worth making for survival.'
          }
        ],
        blueprint: [
          { category: 'Frontend', packages: ['next', 'react', 'react-dom'] },
          { category: 'Database', packages: ['@supabase/supabase-js', '@supabase/ssr'] }
        ],
        operatingCostDrivers: [
          'BaaS Pro Plan (~$25/mo)',
          'Bandwidth egress for user-generated media (photos/videos)',
          'Database reads for massive feed queries at scale'
        ]
      }
    };
  }

  return null;
}
