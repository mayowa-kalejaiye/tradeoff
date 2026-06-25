import { ArchitectureInput, EngineResponse, StackComponent, DeferredDecision, ArchitectureDebt, ArchitectureChallenge, BusinessRisk } from '../types';

export function handlePaaS(input: ArchitectureInput): EngineResponse | null {
  // Pushback: Are they experienced enough to build a PaaS?
  if (input.technicalExperience === 'vibe_coder') {
    return {
      status: 'uncertainty',
      reason: 'Building a Developer Platform (PaaS) requires deep systems engineering knowledge (Linux namespaces, cgroups, network isolation, orchestrators). You cannot build a reliable PaaS using only no-code tools or AI boilerplate.',
      questions: [
        'Do you have a senior platform engineer on the team?',
        'How do you plan to safely execute untrusted customer code?',
        'Are you comfortable managing Kubernetes, Docker, or Firecracker microVMs directly?'
      ]
    };
  }

  // Pushback: Security and Sandboxing
  if (input.teamSize < 3) {
    return {
      status: 'uncertainty',
      reason: 'A team this small will struggle to maintain the control plane and data plane of a cloud platform simultaneously while ensuring multi-tenant security.',
      questions: [
        'How will you handle build cache poisoning between tenants?',
        'How will you prevent a malicious container from escaping the sandbox and accessing the host network or metadata services?',
        'Who is on call for infrastructure incidents when a customer deployment loops and crashes a node?'
      ]
    };
  }

  const stack: StackComponent[] = [
    { name: 'Kubernetes', category: 'other' },
    { name: 'Docker / containerd', category: 'other' },
    { name: 'BuildKit', category: 'other' },
    { name: 'PostgreSQL', category: 'database' },
    { name: 'Redis', category: 'cache' },
    { name: 'MinIO / S3', category: 'database' },
    { name: 'NATS / Kafka', category: 'queue' },
    { name: 'Next.js (Control Plane UI)', category: 'frontend' },
    { name: 'Go / Rust (Data Plane / Proxies)', category: 'backend' }
  ];

  const businessRisks: BusinessRisk[] = [
    {
      risk: 'Multi-Tenant Sandbox Escape',
      level: 'Critical',
      likelihood: 'Low',
      reason: 'If untrusted customer code escapes your container sandbox (e.g. Firecracker or Docker), they can access host metadata, credentials, and other tenants\' workloads. This is an extinction-level event.'
    },
    {
      risk: 'Noisy Neighbor Problem',
      level: 'High',
      likelihood: 'High',
      reason: 'One customer\'s high-CPU or high-bandwidth workload can degrade the performance of the entire node, causing latency spikes for everyone else.'
    },
    {
      risk: 'Supply Chain & Build Poisoning',
      level: 'High',
      likelihood: 'Medium',
      reason: 'Compromised base images or shared build caches can inject malicious code into your customers\' deployments during the CI/CD phase.'
    }
  ];

  const domainConstraints: string[] = [
    'Strict container isolation (namespaces, cgroups, AppArmor/SELinux)',
    'OCI image compatibility',
    'Git webhook reliability and secure secret injection',
    'Zero-downtime rolling deployments',
    'Dynamic reverse proxying (Envoy/Traefik) for custom domains',
    'Tenant-aware horizontal autoscaling'
  ];

  const coreValidationQuestions: string[] = [
    'Can our build runners safely execute malicious Dockerfiles without compromising the host?',
    'Can deployments finish and become routable in under 30 seconds?',
    'How quickly can a failed deployment roll back?',
    'How many concurrent builds can one runner support before OOMing?'
  ];

  const criticalUnknowns: string[] = [
    'How do we safely inject customer secrets at runtime without exposing them to our own logs?',
    'How are preview deployments garbage collected?',
    'How are idle deployments suspended (scale-to-zero) to save cost?',
    'How do we mitigate DDoS attacks against customer domains?'
  ];

  const strategicAdvantages: string[] = [
    'Strong developer lock-in: Once CI/CD and infrastructure are wired to your platform, churn drops to near zero.',
    'High leverage: You are selling compute and convenience, enabling you to capture a high margin if your orchestrator is efficient.'
  ];

  const deferredDecisions: DeferredDecision[] = [
    {
      name: 'Multi-Region High Availability',
      reason: 'Operating a multi-region control plane and global load balancer from Day 1 will paralyze your team. Start with a single region.'
    },
    {
      name: 'Custom MicroVMs (Firecracker)',
      reason: 'While Firecracker offers better isolation and boot times, plain Docker/Kubernetes with strict security contexts is enough for an MVP until you hit severe scale or strict compliance needs.'
    }
  ];

  const architectureDebt: ArchitectureDebt[] = [
    {
      debt: 'Single Kubernetes Cluster',
      reason: 'Running the Control Plane and Data Plane on the same cluster is risky but necessary for MVP speed. Eventually, the control plane must be physically isolated.'
    },
    {
      debt: 'Simple Scheduler',
      reason: 'Bin-packing and resource scheduling will be inefficient initially, leading to higher cloud bills. Optimize for reliability first, unit economics second.'
    }
  ];

  const assumptions: string[] = [
    'Assuming developers will trust a new platform with their production credentials and source code.',
    'Assuming you can maintain high uptime for the dynamic routing layer.'
  ];

  const assumptionRisk: any = {
    level: 'High',
    reason: 'If your routing layer (the ingress/proxy) goes down, every single customer website goes down simultaneously.'
  };

  const revisitWhen: string[] = [
    'You exceed 100 concurrent builds and need a dedicated fleet of ephemeral build runners.',
    'Your cloud compute bill forces you to implement scale-to-zero for idle apps.'
  ];

  const upgradePath: any[] = [
    { stage: 'Stage 1', trigger: 'Initial Launch', description: 'Single K8s cluster. Next.js control plane, Traefik ingress.' },
    { stage: 'Stage 2', trigger: 'Scale and Noisy Neighbors', description: 'Migrate to Firecracker microVMs or strict gVisor boundaries.' },
    { stage: 'Stage 3', trigger: 'Global latency', description: 'Deploy edge proxy layer (e.g. Cloudflare/Fastly) and distribute data planes globally.' }
  ];

  const blueprint: any[] = [
    { category: 'Infrastructure', packages: ['kubernetes', 'docker', 'terraform'] },
    { category: 'Backend', packages: ['go', 'envoy', 'nats'] },
    { category: 'Frontend', packages: ['next', 'react'] }
  ];

  const operatingCostDrivers: string[] = [
    'Idle compute (keeping customer apps warm)',
    'Network egress bandwidth (highly variable)',
    'Storage for container images (Artifact Registry) and build logs'
  ];

  return {
    status: 'success',
    data: {
      businessRisks,
      domainConstraints,
      coreValidationQuestions,
      criticalUnknowns,
      strategicAdvantages,
      architectureStyle: 'Distributed Orchestration & Control Plane',
      confidenceScores: {
        architecture: 98,
        patternSelection: 95,
        deployment: 90,
        cost: 60
      },
      confidenceBreakdown: {
        strongSignals: ['Detected PaaS / Developer Infrastructure archetype', 'Cloud deployment platform requirements'],
        weakSignals: []
      },
      missingInformation: [],
      assumptions,
      assumptionRisk,
      revisitWhen,
      upgradePath,
      stack,
      deployment: ['AWS (EKS) or Bare Metal (Hetzner/OVH) for unit economics'],
      recommended: [
        {
          name: 'Control Plane / Data Plane Separation',
          reasons: [
            'The API that developers use (Control Plane) must never go down, even if the servers running their apps (Data Plane) are overloaded.',
            'Allows you to scale the routing layer independently from the application build runners.'
          ]
        }
      ],
      deferredDecisions,
      architectureDebt,
      challenges: [],
      blueprint,
      operatingCostDrivers
    }
  };
}
