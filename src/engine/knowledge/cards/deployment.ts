import { DecisionGraph, ArchitectureDriver } from '../graph';

export const deploymentGraph: DecisionGraph = {
  nodes: new Map([
    [
      'kubernetes',
      {
        id: 'kubernetes',
        type: 'Implementation',
        name: 'Kubernetes',
        description: 'Production-grade container orchestration',
        systemGroup: 'deployment',
        engineeringComplexity: 'High',
        operationalCost: 'High',
        winsWhen: ['Massive microservice scaling', 'Multi-cloud portability', 'Complex network topologies'],
        losesWhen: ['Small teams', 'Simple CRUD apps', 'No dedicated DevOps'],
        antiPatterns: [],
        counterExamples: [],
        migrationPath: [],
        failureModes: [],
        changesWhen: [],
        principles: ['scale_horizontally'],
        eligibility: {
          anyOf: ['infrastructure.deployment']
        },
        applicability: {
          prefersCapabilities: ['infrastructure.deployment']
        },
        capability: 'compute_deployment',
        drivers: {
          [ArchitectureDriver.Scalability]: 1.0,
          [ArchitectureDriver.Reliability]: 0.9,
          [ArchitectureDriver.DeveloperVelocity]: -0.6
        },
        score: () => 60
      }
    ],
    [
      'aws_ecs',
      {
        id: 'aws_ecs',
        type: 'Implementation',
        name: 'AWS ECS / Fargate',
        description: 'Managed container orchestration on AWS',
        systemGroup: 'deployment',
        engineeringComplexity: 'Medium',
        operationalCost: 'Medium',
        winsWhen: ['Docker deployment needed', 'AWS-centric architecture', 'Lower operational overhead than K8s'],
        losesWhen: ['Multi-cloud required'],
        antiPatterns: [],
        counterExamples: [],
        migrationPath: [],
        failureModes: [],
        changesWhen: [],
        principles: ['cloud_native_integration'],
        eligibility: {
          anyOf: ['infrastructure.deployment']
        },
        applicability: {
          prefersCapabilities: ['infrastructure.deployment']
        },
        capability: 'compute_deployment',
        drivers: {
          [ArchitectureDriver.Scalability]: 0.8,
          [ArchitectureDriver.Reliability]: 0.8,
          [ArchitectureDriver.DeveloperVelocity]: 0.5
        },
        score: () => 70
      }
    ],
    [
      'vercel',
      {
        id: 'vercel',
        type: 'Implementation',
        name: 'Vercel',
        description: 'Frontend cloud & Serverless edge computing',
        systemGroup: 'deployment',
        engineeringComplexity: 'Low',
        operationalCost: 'Medium',
        winsWhen: ['Next.js/React framework', 'Extreme developer velocity', 'Global edge caching'],
        losesWhen: ['Long-running background workers', 'Stateful websockets'],
        antiPatterns: [],
        counterExamples: [],
        migrationPath: [],
        failureModes: [],
        changesWhen: [],
        principles: ['developer_experience_first'],
        eligibility: {
          anyOf: ['infrastructure.deployment']
        },
        applicability: {
          prefersCapabilities: ['infrastructure.deployment']
        },
        capability: 'compute_deployment',
        drivers: {
          [ArchitectureDriver.DeveloperVelocity]: 1.0,
          [ArchitectureDriver.Latency]: 0.8
        },
        score: () => 75
      }
    ],
    [
      'fly_io',
      {
        id: 'fly_io',
        type: 'Implementation',
        name: 'Fly.io',
        description: 'Global application distribution platform',
        systemGroup: 'deployment',
        engineeringComplexity: 'Low',
        operationalCost: 'Low',
        winsWhen: ['Deploying containers close to users', 'Global SQLite clusters', 'Stateful WebSockets'],
        losesWhen: ['Heavy enterprise compliance (FedRAMP)'],
        antiPatterns: [],
        counterExamples: [],
        migrationPath: [],
        failureModes: [],
        changesWhen: [],
        principles: ['locality_beats_latency'],
        eligibility: {
          anyOf: ['infrastructure.deployment']
        },
        applicability: {
          prefersCapabilities: ['infrastructure.deployment']
        },
        capability: 'compute_deployment',
        drivers: {
          [ArchitectureDriver.Latency]: 0.9,
          [ArchitectureDriver.DeveloperVelocity]: 0.9,
          [ArchitectureDriver.Cost]: 0.8
        },
        score: () => 72
      }
    ],
    [
      'aws_lambda',
      {
        id: 'aws_lambda',
        type: 'Implementation',
        name: 'AWS Lambda (Serverless)',
        description: 'Event-driven, scale-to-zero compute',
        systemGroup: 'deployment',
        engineeringComplexity: 'Medium',
        operationalCost: 'Low',
        winsWhen: ['Spiky, unpredictable traffic', 'Event-driven pipelines', 'Strict cost control (scale to zero)'],
        losesWhen: ['Predictable high-throughput (costs explode)', 'Long-running jobs > 15min'],
        antiPatterns: [],
        counterExamples: [],
        migrationPath: [],
        failureModes: [],
        changesWhen: [],
        principles: ['event_driven_by_default'],
        eligibility: {
          anyOf: ['infrastructure.deployment']
        },
        applicability: {
          prefersCapabilities: ['infrastructure.deployment']
        },
        capability: 'compute_deployment',
        drivers: {
          [ArchitectureDriver.Scalability]: 0.9,
          [ArchitectureDriver.Cost]: 0.8
        },
        score: () => 65
      }
    ]
  ] as any),
  edges: []
};
