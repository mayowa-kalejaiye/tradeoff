import { ArchitectureInput, EngineResponse, BusinessRisk } from '../types';

export function handleInternal(input: ArchitectureInput): EngineResponse | null {
  return {
    status: 'success',
    data: {
      architectureStyle: 'BaaS / Low-Code',
      confidenceScores: {
        architecture: 95,
        patternSelection: 95,
        deployment: 98,
        cost: 90
      },
      confidenceBreakdown: {
        strongSignals: ['Domain (Internal Tool)', 'Traffic (< 5,000 Concurrent)', 'Predictable Scale'],
        weakSignals: ['Exact feature scope']
      },
      missingInformation: [],
      assumptions: [
        'Assumes the tool is used primarily by internal employees during business hours.',
        'Assumes a single global region for the database is acceptable latency.'
      ],
      assumptionRisk: {
        level: 'Low',
        reason: 'The monolith is highly resilient to assumption failures at this scale. Even if user count doubles, standard vertical scaling of the DB is sufficient.'
      },
      revisitWhen: [
        'The company decides to spin out the internal tool as a public SaaS product.'
      ],
      upgradePath: [],
      stack: [
        { name: 'Next.js / Ruby on Rails / Django', category: 'frontend' },
        { name: 'PostgreSQL', category: 'database' },
        { name: 'Redis (Background Jobs)', category: 'cache' }
      ],
      deployment: ['Standard PaaS (Render / Heroku)'],
      recommended: [
        {
          name: 'Strict Modular Monolith + Monorepo (Nx/Turborepo)',
          reasons: [
            'Absolutely not. Business context matters more than team size. Recommending microservices and Kafka for an internal CRUD tool used by 3,000 employees is a catastrophic waste of payroll.',
            'A 50-engineer codebase becomes a social problem, not a technical one. Solve this with strict CODEOWNERS, architectural boundaries, and Architecture Decision Records (ADRs) within a monorepo, not network boundaries.'
          ]
        }
      ],
      deferredDecisions: [
        {
          name: 'Microservices / Kubernetes / Kafka',
          reason: 'Intentionally rejected. The operational overhead will destroy the ROI of the internal tool. You do not need distributed systems to serve 3,000 employees.'
        }
      ],
      architectureDebt: [
        {
          debt: 'Team Coordination Friction',
          reason: 'Accepted intentionally. With 50 engineers in a monolith, merge conflicts will happen and CI will be slow, but it is much cheaper than running an internal Kubernetes cluster.'
        }
      ],
      challenges: [
        {
          name: 'Conway\'s Law Rebellion',
          riskLevel: 'High',
          description: 'Engineers will push for microservices because "that\'s how big teams operate." You must enforce strict module boundaries within the monolith instead.'
        },
        {
          name: 'Monorepo Tooling Overhead',
          riskLevel: 'Medium',
          description: 'Setting up Nx or Turborepo correctly takes time, but it pays off when multiple internal tools need to share the same UI components and auth logic.'
        },
        {
          name: 'Social Complexity of Code',
          riskLevel: 'High',
          description: 'With 50 engineers in one repo, you need strict CODEOWNERS rules and ADRs (Architecture Decision Records) to prevent the monolith from becoming a Big Ball of Mud.'
        }
      ],
      businessRisks: [
        {
          risk: 'Shadow IT & Adoption Failure',
          level: 'High',
          likelihood: 'High',
          reason: 'If the internal tool is too slow or lacks SSO integration, employees will bypass it and use spreadsheets, creating data silos and security risks.'
        }
      ],
      domainConstraints: [
        'Single Sign-On (SSO) integration',
        'Role-Based Access Control (RBAC)',
        'Syncing with legacy internal databases (often requires direct DB connections rather than APIs)'
      ],
      coreValidationQuestions: [
        'Does this tool actually save time compared to the existing Google Sheets / Airtable workflow?',
        'Is SSO correctly integrated so employees do not have to create new passwords?'
      ],
      criticalUnknowns: [
        'Will the business actually adopt this internal tool, or just keep using Excel?',
        'Is IT going to block our usage of third-party BaaS providers for internal data?'
      ],
      strategicAdvantages: [
        'Centralized context: Keeps all operational data in one secure boundary.',
        'High development speed since UI aesthetics can take a backseat to utility.'
      ],
      blueprint: [
        { category: 'Frontend', packages: ['react', 'tailwindcss'] }
      ],
      operatingCostDrivers: [
        'Internal developer time (highest cost by far)',
        'SSO/IdP licensing seats (Okta, Entra ID)',
        'Self-hosted database storage for internal operational data'
      ]
    }
  };
}
