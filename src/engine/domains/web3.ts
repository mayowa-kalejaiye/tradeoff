import { ArchitectureInput, EngineResponse, StackComponent, DeferredDecision, ArchitectureDebt, ArchitectureChallenge, BusinessRisk, BlueprintCategory } from '../types';

export function handleWeb3(input: ArchitectureInput): EngineResponse | null {
  const isWeb3 = input.archetypes.includes('web3_dapp') || 
    input.projectIdea.toLowerCase().match(/(crypto|blockchain|ethereum|solana|smart contract|nft|token|defi|dao|wallet|dapp)/);

  if (!isWeb3) {
    return null;
  }

  const stack: StackComponent[] = [
    { name: 'Next.js (Frontend)', category: 'frontend' },
    { name: 'Ethers.js / Viem (Client)', category: 'frontend' },
    { name: 'Alchemy / Infura (RPC Node)', category: 'backend' },
    { name: 'Solidity / Rust (Smart Contracts)', category: 'backend' },
    { name: 'The Graph (Indexing)', category: 'database' },
    { name: 'IPFS / Arweave (Decentralized Storage)', category: 'database' }
  ];

  const businessRisks: BusinessRisk[] = [
    {
      risk: 'Smart Contract Vulnerability',
      level: 'Critical',
      likelihood: 'Medium',
      reason: 'Immutability means zero room for bugs. A single vulnerability in your smart contract can drain all user funds instantly.'
    },
    {
      risk: 'Regulatory & Compliance Risk',
      level: 'High',
      likelihood: 'High',
      reason: 'Tokenomics and DeFi protocols are subject to rapidly changing international securities laws.'
    }
  ];

  const domainConstraints: string[] = [
    'Strict separation of on-chain (immutable) vs off-chain (mutable) data',
    'Gas cost optimization for contract deployments and user transactions',
    'Handling asynchronous block confirmations and chain reorganizations',
    'Wallet connection UX (MetaMask, WalletConnect) and handling disconnected states'
  ];

  const coreValidationQuestions: string[] = [
    'Does this actually need to be decentralized, or could a standard database do the job?',
    'How will you subsidize or manage gas fees for user onboarding?',
    'Are your smart contracts audited by a reputable third-party firm?'
  ];

  const criticalUnknowns: string[] = [
    'Which Layer 1 or Layer 2 network offers the best balance of liquidity and low gas fees for this specific use case?',
    'Will user adoption be throttled by the friction of creating a crypto wallet?'
  ];

  const strategicAdvantages: string[] = [
    'Global, permissionless payment rail out of the box.',
    'Verifiable ownership and provenance of digital assets.',
    'Composability: Your smart contracts can seamlessly integrate with existing DeFi protocols (e.g., Uniswap).'
  ];

  const challenges: ArchitectureChallenge[] = [
    {
      name: 'Off-Chain Indexing',
      riskLevel: 'High',
      description: 'Querying the blockchain directly for relational data is impossible. You MUST build or use an indexer (like The Graph) to serve UI data fast.'
    },
    {
      name: 'Key Management',
      riskLevel: 'High',
      description: 'If you are holding assets on behalf of users (custodial), you take on massive security risk. If non-custodial, UX suffers.'
    }
  ];

  const deferredDecisions: DeferredDecision[] = [
    {
      name: 'Custom AppChain / Layer 3',
      reason: 'Do not launch your own rollup or AppChain until you have proven extreme transaction volume on a standard Layer 2 (e.g., Base, Arbitrum).'
    },
    {
      name: 'Complex Tokenomics (Native Token)',
      reason: 'Launching a token introduces massive regulatory risk and economic engineering complexity. Delay until the core product has undeniable PMF.'
    }
  ];

  const architectureDebt: ArchitectureDebt[] = [
    {
      debt: 'Centralized RPC Reliance',
      reason: 'Relying heavily on Alchemy or Infura makes your "decentralized" app highly centralized at the access layer. Accepted for MVP speed.'
    }
  ];

  const missingInformation: string[] = [
    'Which specific blockchain network are you targeting?',
    'Is this a custodial or non-custodial application?'
  ];

  const assumptions = [
    'Assuming the target audience is already crypto-native or willing to learn wallet mechanics.',
    'Assuming the core value proposition actually benefits from trustless execution.'
  ];

  const assumptionRisk: any = {
    level: 'High',
    reason: 'If users refuse to pay gas fees or manage seed phrases, your entire acquisition funnel collapses.'
  };

  const revisitWhen = [
    'Gas fees on the chosen chain become prohibitive for standard users.',
    'You need to execute transactions automatically on behalf of users (requires Account Abstraction / ERC-4337).'
  ];

  const upgradePath = [
    { stage: 'Stage 1', trigger: 'MVP', description: 'Next.js + Ethers.js + Third-Party RPC (Alchemy) + Solidity Smart Contracts.' },
    { stage: 'Stage 2', trigger: 'UX Friction', description: 'Implement Account Abstraction (ERC-4337) for gasless, seedless logins (e.g., Privy).' },
    { stage: 'Stage 3', trigger: 'Massive Scale', description: 'Deploy a dedicated Layer 2 Rollup or AppChain using OP Stack or Arbitrum Orbit.' }
  ];

  const blueprint: BlueprintCategory[] = [
    { category: 'Frontend', packages: ['next', 'viem', 'wagmi', '@rainbow-me/rainbowkit'] },
    { category: 'Backend', packages: ['ethers', 'hardhat', 'foundry'] },
    { category: 'Database', packages: ['@graphprotocol/graph-ts', 'ipfs-http-client'] }
  ];

  const operatingCostDrivers: string[] = [
    'RPC Node request volume (Alchemy/Infura tiers)',
    'Smart contract audit costs (One-time but massive)',
    'Gas fees for contract deployment and maintenance',
    'Indexer hosting costs (The Graph studio or self-hosted)'
  ];

  return {
    status: 'success',
    data: {
      businessRisks,
      domainConstraints,
      coreValidationQuestions,
      criticalUnknowns,
      strategicAdvantages,
      architectureStyle: 'Decentralized Application (DApp) + RPC Gateway',
      confidenceScores: {
        architecture: 95,
        patternSelection: 90,
        deployment: 80,
        cost: 40
      },
      confidenceBreakdown: {
        strongSignals: ['Web3/Crypto terminology detected'],
        weakSignals: ['Specific blockchain network usually unspecified initially']
      },
      missingInformation,
      assumptions,
      assumptionRisk,
      revisitWhen,
      upgradePath,
      stack,
      deployment: ['Vercel/Netlify for Frontend', 'On-Chain (EVM) for Logic', 'Decentralized Storage (IPFS)'],
      recommended: [
        {
          name: 'The Graph (Subgraphs)',
          reasons: [
            'Blockchain data is not relational. You cannot run "SELECT * WHERE user = X".',
            'An indexer listens to contract events and builds a fast GraphQL API for your frontend.'
          ]
        },
        {
          name: 'Account Abstraction (ERC-4337)',
          reasons: [
            'If you want mainstream adoption, forcing users to write down 12 words and buy ETH for gas is a conversion killer.',
            'Allows you to sponsor gas fees and use social logins.'
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
