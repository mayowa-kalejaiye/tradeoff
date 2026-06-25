import { ArchitectureInput, EngineResponse, StackComponent, DeferredDecision, ArchitectureDebt, ArchitectureChallenge, BusinessRisk } from '../types';

export function handleAIAndAutomation(input: ArchitectureInput): EngineResponse | null {
  const isAutomation = input.projectIdea.toLowerCase().match(/(scrape|scraping|puppeteer|playwright|automation|crawler|bot)/);
  const isAI = input.archetypes.includes('ai_saas') || input.projectIdea.toLowerCase().match(/(ai|llm|openai|anthropic|chatgpt)/);

  // We only handle this if it's explicitly automation/scraping OR AI SaaS.
  if (!isAutomation && !input.archetypes.includes('ai_saas')) {
    return null;
  }

  const stack: StackComponent[] = [
    { name: 'Next.js', category: 'frontend' },
    { name: 'PostgreSQL', category: 'database' }
  ];

  const deferredDecisions: DeferredDecision[] = [];
  const architectureDebt: ArchitectureDebt[] = [];
  const challenges: ArchitectureChallenge[] = [];
  const businessRisks: BusinessRisk[] = [];
  const domainConstraints: string[] = [];
  const coreValidationQuestions: string[] = [];
  const criticalUnknowns: string[] = [];
  const strategicAdvantages: string[] = [];
  const missingInformation: string[] = [];
  const assumptions: string[] = [
    'Assuming background jobs can fail and be retried safely (idempotent).',
    'Assuming latency is acceptable for the end-user (async processing).'
  ];
  let assumptionRisk: any = { level: 'Low', reason: 'Async jobs handle failures well.' };
  const revisitWhen: string[] = [];
  const upgradePath: any[] = [];
  const blueprint: any[] = [];
  const operatingCostDrivers: string[] = [];

  // Default to Monolith + Queues for this domain
  let architectureStyle = 'Modular Monolith + Queue Workers';
  let deployment = ['PaaS (Render / Heroku) for Web', 'Dedicated Worker Instances for Scraping/AI'];

  if (isAutomation) {
    stack.push({ name: 'Playwright / Puppeteer', category: 'backend' });
    stack.push({ name: 'Redis + BullMQ', category: 'queue' });
    
    businessRisks.push({
      risk: 'Platform Dependence (Active Resistance)',
      level: 'Critical',
      likelihood: 'High',
      reason: 'Your entire business depends on external systems (LinkedIn, Indeed, etc.) that actively resist automation. Your moat is highly volatile.'
    });

    coreValidationQuestions.push(
      'Can applications actually be submitted reliably before we are rate-limited?',
      'Can accounts avoid being banned using our proxy rotation strategy?',
      'Do tailored resumes actually outperform generic ones in conversion rate?'
    );

    strategicAdvantages.push(
      'Strong leverage: Code executes tasks that normally require expensive human labor.',
      'Low initial infrastructure cost: You can validate demand with a very small team and a handful of Playwright workers.',
      'Data moat: Over time, the true defensibility comes from historical application performance data, not the automation itself.'
    );

    criticalUnknowns.push(
      'Will job boards legally permit automation?',
      'Will users trust an automated application pipeline with their careers?',
      'Will anti-bot systems escalate faster than our proxy budget can absorb?'
    );

    domainConstraints.push(
      'CAPTCHA handling and bypasses',
      'Proxy rotation and IP reputation management',
      'Browser fingerprinting evasion',
      'Aggressive rate limiting',
      'Human-in-the-loop fallbacks for failed scripts'
    );
    
    challenges.push({
      name: 'Hostile Environments (Anti-Bot)',
      riskLevel: 'High',
      description: 'LinkedIn, Cloudflare, and Datadome will actively block your scrapers. Managing proxies and bypasses will become your actual full-time job.'
    });
    
    challenges.push({
      name: 'DOM Brittleness',
      riskLevel: 'High',
      description: 'Target websites update their UI. Your CSS selectors will break silently. You need robust error handling and alerting when scraping fails.'
    });

    architectureDebt.push({
      debt: 'Application workflow coupled to browser automation layer',
      reason: 'Accepted intentionally. Building a clean abstraction over raw Puppeteer calls is too slow for an MVP. It will be messy, but it ships faster.'
    });

    architectureDebt.push({
      debt: 'Single queue for entirely different workloads',
      reason: 'Operational simplicity. Using the same Redis instance for fast LLM generation and slow browser automation is bad practice at scale, but fine for 100 beta users.'
    });

    missingInformation.push(
      'How often does the target website change its layout?',
      'Do you have a proxy rotation strategy?'
    );
    assumptionRisk = {
      level: 'High',
      reason: 'If the target website introduces CAPTCHAs or blocks your proxy IP ranges, the entire architecture stalls.'
    };
    revisitWhen.push('You need to scale browser automation beyond 50 concurrent sessions (requires specialized infrastructure).');
    upgradePath.push(
      { stage: 'Stage 1', trigger: 'Initial Launch', description: 'Monolith + Single Worker Instance.' },
      { stage: 'Stage 2', trigger: 'Target site bans IPs', description: 'Introduce proxy rotation layer (BrightData, ScraperAPI).' },
      { stage: 'Stage 3', trigger: 'High throughput needed', description: 'Extract automation layer into containerized AWS Batch / ECS tasks.' }
    );
    
    blueprint.push(
      { category: 'Frontend', packages: ['next', 'react', 'react-dom'] },
      { category: 'Backend', packages: ['playwright', 'bullmq', 'ioredis'] },
      { category: 'Database', packages: ['pg', 'drizzle-orm'] }
    );
    
    operatingCostDrivers.push(
      'Browser compute (Playwright sessions are memory-intensive)',
      'Proxy network bandwidth (residential proxies for avoiding bans)',
      'Queue storage (Redis memory for BullMQ jobs)'
    );
  }

  if (isAI) {
    stack.push({ name: 'OpenAI / Anthropic APIs', category: 'ai' });
    
    if (!isAutomation) {
      stack.push({ name: 'Redis + BullMQ', category: 'queue' });
    }

    if (!isAutomation) {
      businessRisks.push({
        risk: 'LLM Wrapper Commoditization',
        level: 'High',
        likelihood: 'High',
        reason: 'If the core product is just a thin UI over an LLM, the underlying foundation models will eventually consume your feature set.'
      });
      coreValidationQuestions.push(
        'Does the workflow provide value beyond what a user could get directly from ChatGPT?',
        'Can you acquire customers cheaper than the underlying AI labs can?'
      );
      criticalUnknowns.push(
        'Will OpenAI/Anthropic release a native feature that obsoletes this workflow next month?'
      );
      strategicAdvantages.push(
        'Extremely fast time-to-market.',
        'Zero upfront cost for foundation models compared to training your own.'
      );
      domainConstraints.push(
        'Prompt injection and jailbreak prevention',
        'Managing non-deterministic outputs',
        'Cost control on token usage'
      );

      assumptionRisk = {
        level: 'Medium',
        reason: 'LLM APIs can degrade in quality or spike in latency without warning. Your app is entirely dependent on OpenAI/Anthropic uptime.'
      };
      revisitWhen.push('LLM context windows get large enough to bypass current chunking strategies.', 'Cost of LLM calls exceeds 30% of revenue.');
      upgradePath.push(
        { stage: 'Stage 1', trigger: 'Initial Launch', description: 'Direct API calls with basic retry logic.' },
        { stage: 'Stage 2', trigger: 'Cost scaling', description: 'Implement semantic caching layer to avoid redundant generation.' },
        { stage: 'Stage 3', trigger: 'Latency becomes critical', description: 'Move to streaming responses with WebSockets.' }
      );
    }
    
    blueprint.push({ category: 'AI', packages: ['openai', 'ai-sdk'] });
    operatingCostDrivers.push('LLM token usage (input/output/reasoning)');

    challenges.push({
      name: 'LLM Hallucinations & Latency',
      riskLevel: 'Medium',
      description: 'LLM calls are slow and unreliable. You must handle long-polling or WebSockets for the UI, and graceful fallbacks for bad generations.'
    });

    deferredDecisions.push({
      name: 'Vector Database (Pinecone, pgvector)',
      reason: 'Intentionally deferred unless semantic search is the core value prop. For task automation, standard prompt engineering and structured outputs are sufficient.'
    });

    deferredDecisions.push({
      name: 'Multi-Agent Architectures (LangChain, AutoGPT)',
      reason: 'Too much operational chaos for an MVP. Rigid, predictable LLM calls inside isolated background jobs are far more reliable than agents going rogue.'
    });
  }

  deferredDecisions.push({
    name: 'Kubernetes / Microservices',
    reason: 'Operational overhead will kill a solo founder/small team. Use a monolith with separate worker processes instead.'
  });

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
        architecture: 95,
        patternSelection: 98,
        deployment: 85,
        cost: 45
      },
      confidenceBreakdown: {
        strongSignals: ['Heavy background jobs required', 'AI/Browser Automation detected', `Team Size: ${input.teamSize}`],
        weakSignals: ['Exact compliance requirements for scraped data']
      },
      missingInformation,
      assumptions,
      assumptionRisk,
      revisitWhen,
      upgradePath,
      stack,
      deployment,
      recommended: [
        {
          name: 'Modular Monolith + Async Queues',
          reasons: [
            'Scraping and LLM generation are slow, error-prone, and asynchronous by nature.',
            'You absolutely need isolated background queues to handle retries and timeouts, but you do NOT need a distributed microservices network to run them.'
          ]
        }
      ],
      deferredDecisions,
      architectureDebt,
      challenges,
      blueprint,
      operatingCostDrivers
    }
  };
}
