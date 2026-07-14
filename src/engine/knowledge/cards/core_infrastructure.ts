import { DecisionGraph, ArchitectureDriver } from '../graph';

export const coreInfrastructureGraph: DecisionGraph = {
  nodes: new Map([
    [
      'temporal_orchestration',
      {
        id: 'temporal_orchestration',
        type: 'Implementation',
        name: 'Temporal',
        description: 'Durable execution and workflow orchestration',
        systemGroup: 'core',
        engineeringComplexity: 'High',
        operationalCost: 'Medium',
        winsWhen: ['Long-running reliable workflows', 'Complex retries needed'],
        losesWhen: ['Simple cron jobs', 'Stateless operations'],
        antiPatterns: [],
        counterExamples: [],
        migrationPath: [],
        failureModes: [],
        changesWhen: [],
        principles: ['prefer_deterministic'],
        eligibility: {
          anyOf: ['data.workflow_orchestration', 'ai.agent_orchestration']
        },
        applicability: {
          prefersCapabilities: ['data.workflow_orchestration', 'ai.agent_orchestration']
        },
        capability: 'workflow_orchestration',
        drivers: {
          [ArchitectureDriver.Reliability]: 1.0,
          [ArchitectureDriver.Scalability]: 0.8
        },
        score: () => 70
      }
    ],
    [
      'redis_cache',
      {
        id: 'redis_cache',
        type: 'Implementation',
        name: 'Redis',
        description: 'In-memory data structure store',
        systemGroup: 'core',
        engineeringComplexity: 'Low',
        operationalCost: 'Low',
        winsWhen: ['Fast distributed caching', 'Session storage'],
        losesWhen: ['Persistent source of truth', 'Relational data'],
        antiPatterns: [],
        counterExamples: [],
        migrationPath: [],
        failureModes: [],
        changesWhen: [],
        principles: ['locality_beats_latency'],
        eligibility: {
          anyOf: ['data.caching', 'communication.realtime', 'communication.async', 'ai.agent_orchestration']
        },
        applicability: {
          prefersCapabilities: ['data.caching']
        },
        capability: 'caching_strategy',
        drivers: {
          [ArchitectureDriver.Latency]: 1.0,
          [ArchitectureDriver.Scalability]: 0.8
        },
        score: () => 70
      }
    ],
    [
      'websockets',
      {
        id: 'websockets',
        type: 'Implementation',
        name: 'WebSockets',
        description: 'Full-duplex real-time communication',
        systemGroup: 'core',
        engineeringComplexity: 'Medium',
        operationalCost: 'Low',
        winsWhen: ['Browser real-time collaboration', 'Chat apps'],
        losesWhen: ['One-way server events (use SSE)', 'IoT telemetry (use MQTT)'],
        antiPatterns: [],
        counterExamples: [],
        migrationPath: [],
        failureModes: [],
        changesWhen: [],
        principles: [],
        eligibility: {
          anyOf: ['communication.realtime', 'communication.browser']
        },
        applicability: {
          prefersCapabilities: ['communication.realtime']
        },
        capability: 'realtime_communication',
        drivers: {
          [ArchitectureDriver.Latency]: 0.9,
          [ArchitectureDriver.DeveloperVelocity]: 0.7
        },
        score: () => 70
      }
    ],
    [
      'cockroachdb',
      {
        id: 'cockroachdb',
        type: 'Implementation',
        name: 'CockroachDB',
        description: 'Distributed SQL database',
        systemGroup: 'core',
        engineeringComplexity: 'High',
        operationalCost: 'High',
        winsWhen: ['Global strong consistency', 'Massive scale with SQL', 'Zero downtime tolerance'],
        losesWhen: ['Single region low traffic', 'Budget constraints'],
        antiPatterns: [],
        counterExamples: [],
        migrationPath: [],
        failureModes: [],
        changesWhen: [],
        principles: ['prefer_deterministic'],
        eligibility: {
          anyOf: ['data.transactional_integrity']
        },
        applicability: {
          prefersCapabilities: ['data.transactional_integrity']
        },
        capability: 'relational_database',
        drivers: {
          [ArchitectureDriver.Reliability]: 1.0,
          [ArchitectureDriver.Scalability]: 1.0,
          [ArchitectureDriver.Availability]: 1.0,
          [ArchitectureDriver.Cost]: -0.5
        },
        score: () => 60 // Baseline lower due to cost, driver multiplier pushes it up
      }
    ],
    [
      'qdrant_vector',
      {
        id: 'qdrant_vector',
        type: 'Implementation',
        name: 'Qdrant',
        description: 'Vector database for semantic search',
        systemGroup: 'core',
        engineeringComplexity: 'Medium',
        operationalCost: 'Medium',
        winsWhen: ['Semantic search', 'RAG pipelines'],
        losesWhen: ['Keyword-only search', 'Relational queries'],
        antiPatterns: [],
        counterExamples: [],
        migrationPath: [],
        failureModes: [],
        changesWhen: [],
        principles: [],
        eligibility: {
          anyOf: ['ai.vector_search']
        },
        applicability: {
          prefersCapabilities: ['ai.vector_search']
        },
        capability: 'vector_database',
        drivers: {
          [ArchitectureDriver.Scalability]: 0.8,
          [ArchitectureDriver.DeveloperVelocity]: 0.8
        },
        score: () => 70
      }
    ]
  ] as any),
  edges: []
};
