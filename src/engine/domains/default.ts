import { ArchitectureInput, EngineResponse, BlueprintCategory, RecommendedItem, RejectedItem, StackComponent, ArchitectureChallenge, DeferredDecision, ArchitectureDebt, BusinessRisk } from '../types';

export function handleDefault(input: ArchitectureInput): EngineResponse {
  const stack: StackComponent[] = [];
  const deployment: string[] = [];
  const recommended: RecommendedItem[] = [];
  const deferredDecisions: DeferredDecision[] = [];
  const challenges: ArchitectureChallenge[] = [];
  const blueprint: BlueprintCategory[] = [];
  const missingInformation: string[] = [];
  const assumptions: string[] = [];
  const revisitWhen: string[] = [];
  const upgradePath: any[] = [];
  const architectureDebt: ArchitectureDebt[] = [];
  const businessRisks: BusinessRisk[] = [];
  const domainConstraints: string[] = [];
  const coreValidationQuestions: string[] = [];
  const criticalUnknowns: string[] = [];
  const strategicAdvantages: string[] = [];
  
  let architectureStyle = 'Modular Monolith';
  let confidenceLevel: 'High' | 'Moderate' | 'Low' = 'Moderate';
  
  let teamSignal = 35;
  let trafficSignal = input.expectedUsers < 50000 ? 30 : 15;
  let prioritySignal = input.priority === 'speed' ? 20 : 10;
  let score = teamSignal + trafficSignal + prioritySignal;
  confidenceLevel = score > 60 ? 'High' : score > 40 ? 'Moderate' : 'Low';

  if (input.teamSize <= 2) {
    architectureStyle = 'Modular Monolith';
    
    recommended.push({
      name: 'Modular Monolith',
      reasons: [
        'Fastest path to market with acceptable scalability.',
        'Single deployment pipeline reduces DevOps overhead completely.',
        'Easier to refactor and maintain for a small team.'
      ]
    });
    deferredDecisions.push({
      name: 'Microservices',
      reason: 'Operational complexity vastly exceeds project needs. Requires dedicated DevOps.'
    });

    challenges.push({ name: 'Monolith Entanglement', riskLevel: 'Medium', description: 'Without discipline, domain boundaries will bleed, making future extraction hard.' });
    
    architectureDebt.push({
      debt: 'Single Point of Failure',
      reason: 'Accepted intentionally because the operational cost of high availability microservices would crush a 2-person team.'
    });

    revisitWhen.push('Team grows beyond 6-8 engineers working on overlapping code boundaries.');
    revisitWhen.push('Deployments take longer than 15 minutes due to monolithic test suites.');
  } else {
    architectureStyle = 'Event-driven Modular Monolith';
    recommended.push({
      name: 'Event-driven Modular Monolith',
      reasons: ['Decouples high-throughput services via message queues.', 'Maintains core domain cohesiveness better than pure microservices.']
    });
    revisitWhen.push('Specific sub-domains require scaling completely independently of the main API.');
  }

  // --- Stack Selection ---
  stack.push({ name: 'Next.js (App Router)', category: 'frontend' });
  recommended.push({
    name: 'Next.js',
    reasons: [
      input.priority === 'speed' ? 'Optimizes for speed by keeping frontend and API routes in one codebase.' : 'Industry standard React framework with massive ecosystem support.'
    ]
  });
  blueprint.push({ category: 'Frontend', packages: ['next', 'react', 'react-dom', 'tailwindcss'] });
  deployment.push('Vercel');

  if (input.technicalExperience === 'vibe_coder') {
    stack.push({ name: 'Supabase', category: 'database' });
    recommended.push({
      name: 'Supabase',
      reasons: ['Handles PostgreSQL database, Authentication, and Edge Functions out of the box.']
    });
    deployment.push('Supabase Cloud');
    blueprint.push({ category: 'Database', packages: ['@supabase/supabase-js'] });
    architectureDebt.push({
      debt: 'Vendor Lock-in (Supabase)',
      reason: 'Accepted intentionally to maximize initial delivery speed and avoid managing infrastructure.'
    });
  } else {
    stack.push({ name: 'PostgreSQL', category: 'database' });
    recommended.push({
      name: 'PostgreSQL',
      reasons: ['Strong relational consistency.', 'Most robust open-source database available.']
    });
    deployment.push('Neon (Serverless Postgres)');
    blueprint.push({ category: 'Database', packages: ['pg', 'drizzle-orm'] });
  }

  if (input.expectedUsers > 50000 || input.priority === 'scale') {
    stack.push({ name: 'Redis', category: 'cache' });
    recommended.push({ name: 'Redis', reasons: ['Essential for offloading heavy read queries from the primary database.'] });
    deployment.push('Upstash (Serverless Redis)');
  }

  const operatingCostDrivers: string[] = [
    'Database compute and storage (primary bottleneck)',
    'Serverless function invocations and edge bandwidth',
    'Third-party auth providers (if usage exceeds free tiers)',
    'Background job queue storage'
  ];

  businessRisks.push({
    risk: 'Premature Scaling Costs',
    level: 'High',
    likelihood: 'Medium',
    reason: 'Adopting an enterprise-grade stack without enterprise-grade revenue will bankrupt a startup.'
  });
  domainConstraints.push('Resource isolation per tenant', 'Standard RBAC');
  
  coreValidationQuestions.push(
    'Is anyone actually willing to pay for this workflow?',
    'Does the MVP solve the core problem, or is it bloated with nice-to-haves?'
  );

  criticalUnknowns.push(
    'Is there a hard technical limitation to this business model that we haven\'t hit yet?',
    'Can we successfully migrate off serverless if the unit economics flip?'
  );

  strategicAdvantages.push(
    'Boring technology: You can easily hire developers who know Postgres and React.',
    'Fastest time to market for a standard SaaS MVP.'
  );

  return {
    status: 'success',
    data: {
      businessRisks,
      domainConstraints,
      coreValidationQuestions,
      criticalUnknowns,
      strategicAdvantages,
      architectureStyle,
      confidenceScores: {
        architecture: 90,
        patternSelection: 95,
        deployment: 85,
        cost: 65
      },
      confidenceBreakdown: {
        strongSignals: ['Team Size', 'Expected Traffic'],
        weakSignals: ['Exact business domain (Defaulted to SaaS)']
      },
      missingInformation,
      assumptions,
      assumptionRisk: {
        level: 'Low',
        reason: 'The monolith is highly resilient to assumption failures at this scale.'
      },
      revisitWhen,
      upgradePath,
      stack,
      deployment,
      recommended,
      deferredDecisions,
      architectureDebt,
      challenges,
      blueprint,
      operatingCostDrivers
    }
  };
}
