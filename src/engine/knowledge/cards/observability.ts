import { 
  DecisionGraph, 
  DecisionContext, 
  ArchitectureDriver 
} from '../graph';

export const observabilityGraph: DecisionGraph = {
  nodes: new Map([
    ['opentelemetry', {
      id: 'opentelemetry',
      type: 'Implementation',
      name: 'OpenTelemetry',
      description: 'Vendor-neutral standard for instrumenting, generating, collecting, and exporting telemetry data (metrics, logs, and traces).',
      systemGroup: 'observability',
      capability: 'telemetry_collection',
      kind: 'fact',
      strength: 'strongly_recommended',
      gains: [
        'Vendor lock-in avoidance for observability backends',
        'Unified standard for traces, metrics, and logs',
        'Rich ecosystem of language SDKs and instrumentation libraries'
      ],
      costs: [
        'Complex initial setup and configuration',
        'Collector overhead and resource usage'
      ],
      alternatives: [
        {
          id: 'vendor_specific_agents',
          reasonRejected: 'Creates tight coupling to a single vendor (e.g., Datadog, New Relic) and makes migration difficult.',
          whenItWins: 'When a vendor provides out-of-the-box features that are strictly required and team lacks resources to manage OpenTelemetry.'
        }
      ],
      invalidWhen: [
        'No backend services to monitor'
      ],
      drivers: {
        [ArchitectureDriver.Maintainability]: 0.9,
        [ArchitectureDriver.DeveloperVelocity]: 0.7,
        [ArchitectureDriver.Reliability]: 0.8,
      },
      authorities: {
        [DecisionContext.Observability]: 0.95,
        [DecisionContext.Telemetry]: 0.9,
      },
      score: (model) => model.scale !== 'mvp' || model.teamSize > 3 ? 90 : 40
    }],
    ['distributed_tracing', {
      id: 'distributed_tracing',
      type: 'Capability',
      name: 'Distributed Tracing',
      description: 'Tracking requests as they flow across multiple distributed services to identify latency bottlenecks and failures.',
      systemGroup: 'observability',
      capability: 'Performance Monitoring',
      kind: 'rule',
      strength: 'strongly_recommended',
      gains: [
        'Enables pinpointing latency issues in complex microservice architectures',
        'Provides visual dependency graphs of service interactions',
        'Accelerates mean time to resolution (MTTR) for complex bugs'
      ],
      costs: [
        'Performance overhead on instrumented applications',
        'High storage and network costs for trace data (often requiring sampling)',
        'Requires consistent context propagation across all services'
      ],
      alternatives: [
        {
          id: 'log_correlation_only',
          reasonRejected: 'Logs with correlation IDs lack timing information across spans and are harder to visualize.',
          whenItWins: 'Simple monolithic applications or very low traffic systems.'
        }
      ],
      invalidWhen: [
        'Single monolithic application without external dependencies'
      ],
      drivers: {
        [ArchitectureDriver.Maintainability]: 0.9,
        [ArchitectureDriver.Reliability]: 0.8,
        [ArchitectureDriver.Cost]: -0.6,
      },
      authorities: {
        [DecisionContext.Observability]: 0.9,
        [DecisionContext.Telemetry]: 0.8,
      },
      score: (model) => model.scale === 'massive' || model.criticality === 'financial_critical' ? 95 : 60
    }],
    ['mission_replay', {
      id: 'mission_replay',
      type: 'Capability',
      name: 'Mission Replay',
      description: 'The ability to exactly reconstruct the state of a system (especially physical systems like robots) over time using recorded data.',
      systemGroup: 'observability',
      capability: 'System Diagnostics',
      kind: 'rule',
      strength: 'strongly_recommended',
      gains: [
        'Invaluable for debugging complex failures in the field',
        'Provides ground truth for simulation and model training',
        'Ensures safety-critical incidents can be audited perfectly'
      ],
      costs: [
        'Requires massive storage for high-fidelity data',
        'Complex synchronization of data streams',
        'Custom tooling often required for visualization'
      ],
      alternatives: [
        {
          id: 'standard_logging',
          reasonRejected: 'Standard text logs do not capture enough high-dimensional state (e.g., images, point clouds) to recreate physical events.',
          whenItWins: 'Pure software applications without complex physical interactions.'
        }
      ],
      invalidWhen: [
        'Pure web applications without complex state'
      ],
      drivers: {
        [ArchitectureDriver.Safety]: 0.95,
        [ArchitectureDriver.Reliability]: 0.9,
        [ArchitectureDriver.Cost]: -0.7,
      },
      authorities: {
        [DecisionContext.Observability]: 0.8,
        [DecisionContext.SafetyControl]: 0.9,
        [DecisionContext.FleetOps]: 0.8,
      },
      score: (model) => model.capabilities?.some(a => a.name === 'robotics' || a.name === 'autonomous_vehicle' || a.name === 'safety_critical') || model.criticality === 'safety_critical' ? 95 : 10
    }],
    ['command_audit_log', {
      id: 'command_audit_log',
      type: 'Capability',
      name: 'Command Audit Log',
      description: 'A tamper-evident, append-only record of all commands and state changes executed within the system.',
      systemGroup: 'compliance',
      capability: 'Security Auditing',
      kind: 'rule',
      strength: 'critical',
      gains: [
        'Provides undeniable proof of who did what and when',
        'Essential for regulatory compliance (SOC2, HIPAA, etc.)',
        'Aids in post-incident forensics'
      ],
      costs: [
        'Storage costs grow indefinitely',
        'Must be protected from tampering, requiring secure storage solutions',
        'Can impact write latency if synchronously committed'
      ],
      alternatives: [
        {
          id: 'ephemeral_logs',
          reasonRejected: 'Easily lost, tampered with, or expired, failing compliance requirements.',
          whenItWins: 'Non-critical systems without regulatory pressure.'
        }
      ],
      invalidWhen: [],
      drivers: {
        [ArchitectureDriver.Security]: 0.95,
        [ArchitectureDriver.Compliance]: 0.95,
        [ArchitectureDriver.Maintainability]: 0.6,
      },
      authorities: {
        [DecisionContext.Observability]: 0.7,
        [DecisionContext.Identity]: 0.6,
        [DecisionContext.SafetyControl]: 0.8,
      },
      score: (model) => model.complianceLevel !== undefined && model.complianceLevel !== 'unknown' || model.criticality === 'financial_critical' ? 100 : 40
    }],
    ['sensor_recording', {
      id: 'sensor_recording',
      type: 'Capability',
      name: 'Sensor Data Recording',
      description: 'Continuous or event-triggered logging of raw and processed sensor data (video, LiDAR, IMU) for off-vehicle analysis.',
      systemGroup: 'data_pipeline',
      capability: 'Data Ingestion',
      kind: 'rule',
      strength: 'strongly_recommended',
      gains: [
        'Enables model retraining and dataset expansion',
        'Critical for validation of new algorithms against real-world data',
        'Supports mission replay capabilities'
      ],
      costs: [
        'Extremely high storage and transmission costs',
        'Requires careful data retention and sampling policies',
        'Potential privacy concerns with raw data (e.g., faces in video)'
      ],
      alternatives: [
        {
          id: 'on_edge_processing_only',
          reasonRejected: 'Loses the raw data permanently, preventing offline training or detailed forensics.',
          whenItWins: 'Strict privacy requirements or zero available network/storage bandwidth.'
        }
      ],
      invalidWhen: [
        'No physical sensors in the system'
      ],
      drivers: {
        [ArchitectureDriver.DeveloperVelocity]: 0.8,
        [ArchitectureDriver.Cost]: -0.9,
        [ArchitectureDriver.Reliability]: 0.6,
      },
      authorities: {
        [DecisionContext.Telemetry]: 0.9,
        [DecisionContext.Storage]: 0.8,
        [DecisionContext.FleetOps]: 0.7,
      },
      score: (model) => model.capabilities?.some(a => a.name === 'computer_vision' || a.name === 'robotics') ? 90 : 5
    }]
  ]),
  edges: [
    {
      sourceId: 'opentelemetry',
      targetId: 'distributed_tracing',
      type: 'enables',
      strength: 'mandatory'
    },
    {
      sourceId: 'sensor_recording',
      targetId: 'mission_replay',
      type: 'requires',
      strength: 'mandatory'
    }
  ]
};
