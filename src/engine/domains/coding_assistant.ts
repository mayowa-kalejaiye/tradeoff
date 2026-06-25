import { ArchitectureInput, EngineResponse, StackComponent, DeferredDecision, ArchitectureDebt, ArchitectureChallenge, BusinessRisk } from '../types';

export function handleCodingAssistant(input: ArchitectureInput): EngineResponse | null {
  const isCodingAssistant = input.archetypes.includes('ai_coding_assistant') || 
    input.projectIdea.toLowerCase().match(/(cursor|copilot|coding assistant|ide|code generation|developer tool)/);

  if (!isCodingAssistant) {
    return null;
  }

  const stack: StackComponent[] = [
    { name: 'Electron / Tauri / VS Code Fork', category: 'frontend' },
    { name: 'Language Server Protocol (LSP)', category: 'backend' },
    { name: 'Local Inference (Ollama) / Cloud LLMs', category: 'ai' },
    { name: 'Vector DB (Pinecone / local pgvector)', category: 'database' }
  ];

  const businessRisks: BusinessRisk[] = [
    {
      risk: 'LLM Wrapper Commoditization',
      level: 'High',
      likelihood: 'High',
      reason: 'If you only rely on cloud LLMs for generation without superior local context retrieval, you offer no moat over generic ChatGPT.'
    },
    {
      risk: 'User Privacy & IP Leakage',
      level: 'Critical',
      likelihood: 'Medium',
      reason: 'Developers are extremely wary of uploading proprietary code to third-party cloud LLMs. An opt-out or local-only mode is crucial.'
    }
  ];

  const domainConstraints: string[] = [
    'Repository indexing and retrieval (AST parsing)',
    'Context window management & Embedding refresh strategy',
    'Large codebase search latency',
    'Local vs Cloud inference privacy boundaries',
    'Multi-file edit orchestration'
  ];

  const coreValidationQuestions: string[] = [
    'How does your retrieval architecture outperform Cursor or Copilot?',
    'Will developers trust your tool with their proprietary codebase?',
    'Are you relying purely on a cloud LLM, or do you have a fast local proxy?'
  ];

  const criticalUnknowns: string[] = [
    'Will OpenAI or Anthropic release a natively superior editor integration?',
    'How much context can we retrieve locally in under 200ms?'
  ];

  const strategicAdvantages: string[] = [
    'Hyper-specific local context beats generic massive models.',
    'Agentic workflows (letting the AI run tests and iterate) are the future of coding.'
  ];

  const challenges: ArchitectureChallenge[] = [
    {
      name: 'Embedding Latency',
      riskLevel: 'High',
      description: 'Hashing and embedding an entire enterprise codebase takes time. You need a fast, incremental indexing strategy.'
    },
    {
      name: 'Agent Execution Sandbox',
      riskLevel: 'High',
      description: 'If the AI can run terminal commands, you must sandbox execution to prevent accidental rm -rf / or malicious prompt injection.'
    }
  ];

  const deferredDecisions: DeferredDecision[] = [
    {
      name: 'Remote Cloud Development Environments (CDEs)',
      reason: 'Do not build a cloud sync or remote dev environment until the local standalone experience is flawless.'
    },
    {
      name: 'Proprietary Fine-Tuned Models',
      reason: 'Use off-the-shelf models (GPT-4o, Claude 3.5 Sonnet) first. Fine-tuning for code generation is a distraction for an MVP.'
    }
  ];

  const architectureDebt: ArchitectureDebt[] = [
    {
      debt: 'Tightly coupled to VS Code API',
      reason: 'If building a VS Code extension, you are at the mercy of their extension API limitations. A fork gives more power but massive maintenance debt.'
    }
  ];

  const missingInformation: string[] = [
    'Are you building an extension, a standalone IDE, or a CLI?',
    'Will you support local open-source models for privacy?'
  ];

  const assumptions = [
    'Assuming the primary value prop is understanding the entire codebase, not just the active file.',
    'Assuming users have internet access for primary cloud generation.'
  ];

  const assumptionRisk: any = {
    level: 'High',
    reason: 'If developers refuse to grant cloud access to their codebase, you must pivot entirely to local inference, changing the entire architecture.'
  };

  const revisitWhen = [
    'Local open-source models surpass GPT-4 in coding capabilities (shift entirely to local).',
    'Context windows exceed 10 million tokens reliably.'
  ];

  const upgradePath = [
    { stage: 'Stage 1', trigger: 'MVP', description: 'VS Code Extension + Pinecone + OpenAI API.' },
    { stage: 'Stage 2', trigger: 'Privacy Requirements', description: 'Introduce local embedding and inference via Ollama.' },
    { stage: 'Stage 3', trigger: 'Full Control Needed', description: 'Fork VS Code into a standalone IDE (Cursor model).' }
  ];

  return {
    status: 'success',
    data: {
      businessRisks,
      domainConstraints,
      coreValidationQuestions,
      criticalUnknowns,
      strategicAdvantages,
      architectureStyle: 'Desktop Client + LSP + Retrieval Engine',
      confidenceScores: {
        architecture: 90,
        patternSelection: 95,
        deployment: 80,
        cost: 60
      },
      confidenceBreakdown: {
        strongSignals: ['IDE/Coding Assistant mentioned', 'Context retrieval implied'],
        weakSignals: ['Deployment strategy (Extension vs Standalone) is ambiguous']
      },
      missingInformation,
      assumptions,
      assumptionRisk,
      revisitWhen,
      upgradePath,
      stack,
      deployment: ['User Machines (Desktop App / Extension)', 'Cloud API Gateway (Optional)'],
      recommended: [
        {
          name: 'Vector Retrieval Layer',
          reasons: [
            'The assistant must understand large codebases that exceed model context windows.',
            'Without fast similarity search, the LLM is just a generic chatbot.'
          ]
        },
        {
          name: 'Language Server Protocol (LSP) Integration',
          reasons: [
            'Required to get real-time syntax errors, go-to-definition, and accurate file structures to feed to the LLM.'
          ]
        }
      ],
      deferredDecisions,
      architectureDebt,
      challenges,
      blueprint: [
        { category: 'Frontend', packages: ['electron', 'vscode-extension-telemetry'] },
        { category: 'AI', packages: ['langchain', 'pinecone-client', 'ollama'] },
        { category: 'Backend', packages: ['tree-sitter', 'typescript'] }
      ],
      operatingCostDrivers: [
        'Cloud LLM Token Usage (Input/Output/Reasoning)',
        'Vector DB Storage & Querying',
        'API Gateway Bandwidth'
      ]
    }
  };
}
