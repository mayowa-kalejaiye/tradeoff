import { ArchitectureInput, EngineResponse } from '../types';

export function handleSearchEngine(input: ArchitectureInput): EngineResponse | null {
  if (input.technicalExperience === 'vibe_coder') {
    return {
      status: 'uncertainty',
      reason: 'Building a true search engine (crawlers, distributed indexing, TF-IDF/BM25 tuning, vector search) requires specialized distributed systems knowledge. It is not just a CRUD app with a search bar.',
      questions: [
        'How large is the corpus you plan to index?',
        'What is your expected indexing latency (real-time streaming updates vs nightly batch jobs)?',
        'How are you handling ranking, relevance, and semantic search vs exact match?'
      ]
    };
  }

  if (input.teamSize < 2) {
    return {
      status: 'uncertainty',
      reason: 'Operating a search cluster at scale while managing web crawlers and relevance tuning is usually too much for a solo developer to handle reliably.',
      questions: [
        'Will you use a managed service like Algolia or build on Elasticsearch/OpenSearch?',
        'How are you preventing your crawlers from getting caught in infinite loops or honeypots?',
        'Who manages the cluster when an index rebuild takes the nodes offline?'
      ]
    };
  }

  return {
    status: 'success',
    data: {
      businessRisks: [
        {
          risk: 'Stale Indexes & Poor Relevance',
          level: 'High',
          likelihood: 'High',
          reason: 'Users will abandon the search engine if results are outdated or if the relevance ranking returns garbage. Search is binary: it either feels magical or broken.'
        },
        {
          risk: 'Crawler Traps & Infrastructure Spend',
          level: 'High',
          likelihood: 'Medium',
          reason: 'If building a generic web crawler, infinite loops and dynamic URLs can bankrupt your infrastructure bandwidth and storage.'
        }
      ],
      domainConstraints: [
        'Distributed inverted indexing and sharding',
        'Incremental indexing without downtime',
        'Deduplication of ingested documents',
        'Query planning and tokenization pipelines'
      ],
      coreValidationQuestions: [
        'Can we index 1 million documents and still return queries in < 100ms?',
        'Are our crawlers respecting robots.txt and rate limits?',
        'How do we handle typos and stemming?'
      ],
      criticalUnknowns: [
        'What is the true cost of storage when the corpus hits 10TB?',
        'How much tuning will the BM25 algorithm require for this specific domain?',
        'Do we need embeddings (Vector Search) or is lexical search enough?'
      ],
      strategicAdvantages: [
        'A finely-tuned, domain-specific search engine creates a massive moat against generic search engines like Google.',
        'High lock-in for enterprise customers if integrated with their private data.'
      ],
      architectureStyle: 'Distributed Indexing Pipeline',
      confidenceScores: { architecture: 95, patternSelection: 95, deployment: 90, cost: 60 },
      confidenceBreakdown: { strongSignals: ['Search Engine Archetype'], weakSignals: [] },
      missingInformation: [],
      assumptions: ['Assuming high read-to-write ratio for standard search traffic.'],
      assumptionRisk: { level: 'Medium', reason: 'If the corpus updates constantly, the indexing nodes will become the bottleneck.' },
      revisitWhen: ['Query latency exceeds 200ms', 'Index size outgrows available RAM for caching'],
      upgradePath: [
        { stage: 'Stage 1', description: 'Managed OpenSearch / Elasticsearch cluster', trigger: 'Launch' },
        { stage: 'Stage 2', description: 'Hybrid Search (Lexical + Vector DB)', trigger: 'Semantic relevance needed' }
      ],
      stack: [
        { name: 'Elasticsearch / OpenSearch', category: 'database' },
        { name: 'Kafka', category: 'queue' },
        { name: 'Scrapy / Go Crawlers', category: 'backend' },
        { name: 'Redis (Query Cache)', category: 'cache' },
        { name: 'Next.js', category: 'frontend' }
      ],
      deployment: ['AWS Managed OpenSearch', 'ECS / EKS for Crawlers'],
      recommended: [{ name: 'Event-Driven Ingestion', reasons: ['Decouple the crawling/scraping phase from the actual indexing phase to prevent cluster overload.'] }],
      deferredDecisions: [{ name: 'Custom Ranking ML Models', reason: 'Start with standard BM25. Custom Learn-To-Rank (LTR) models require too much training data.' }],
      architectureDebt: [{ debt: 'Heavy reliance on JVM (Elasticsearch)', reason: 'Standard industry tradeoff.' }],
      challenges: [],
      blueprint: [
        { category: 'Database', packages: ['elasticsearch'] },
        { category: 'Infrastructure', packages: ['kafkajs'] }
      ],
      operatingCostDrivers: ['RAM for Elasticsearch nodes (indexes must be in memory for speed)', 'Network egress for crawlers', 'Storage costs for the raw corpus']
    }
  };
}
