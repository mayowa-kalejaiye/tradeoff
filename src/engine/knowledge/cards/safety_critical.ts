import {
  DecisionGraph,
  DecisionNode,
  DecisionContext,
  ArchitectureDriver
} from '../graph';

export const safetyCriticalGraph: DecisionGraph = {
  nodes: new Map<string, DecisionNode>([
    ['degraded_ops', {
      id: 'degraded_ops',
      type: 'Capability',
      name: 'Degraded Operation Modes',
      description: 'System continues functioning safely even if cloud connectivity is lost',
      systemGroup: 'safety_systems',
      capability: 'Fault Tolerance',
      kind: 'rule',
      strength: 'critical',
      gains: [
        'Guarantees basic safety under network partitions',
        'Improves system availability metrics'
      ],
      costs: [
        'High complexity in state synchronization',
        'Requires sophisticated edge software architecture'
      ],
      alternatives: [
        {
          id: 'always_connected',
          reasonRejected: 'Violates core safety requirements for autonomous operation'
        }
      ],
      invalidWhen: [
        'System operates in guaranteed continuous connectivity environments'
      ],
      drivers: {
        [ArchitectureDriver.Availability]: 0.99,
        [ArchitectureDriver.Safety]: 1.0,
        [ArchitectureDriver.Reliability]: 0.95
      },
      authorities: {
        [DecisionContext.SafetyControl]: 1.0,
        [DecisionContext.FleetOps]: 0.8
      },
      score: (model) => model.criticality === 'safety_critical' ? 100 : 0
    }],
    ['watchdogs', {
      id: 'watchdogs',
      type: 'Implementation',
      name: 'Hardware & Software Watchdogs',
      description: 'Automated fail-safes that trigger emergency stops if heartbeat is lost',
      systemGroup: 'safety_systems',
      capability: 'Health Monitoring',
      kind: 'fact',
      strength: 'critical',
      gains: [
        'Deterministic failure recovery',
        'Prevents runaway processes in edge compute'
      ],
      costs: [
        'Requires dedicated hardware integration',
        'Tuning heartbeat timeouts can be difficult'
      ],
      alternatives: [
        {
          id: 'software_only_watchdogs',
          reasonRejected: 'Software bugs could freeze the watchdog itself'
        }
      ],
      invalidWhen: [
        'System is purely virtual with no physical consequences'
      ],
      drivers: {
        [ArchitectureDriver.Reliability]: 0.98,
        [ArchitectureDriver.Safety]: 0.95
      },
      authorities: {
        [DecisionContext.SafetyControl]: 0.95,
        [DecisionContext.Compute]: 0.6
      },
      score: (model) => model.criticality === 'safety_critical' ? 95 : 0
    }],
    ['operator_intervention', {
      id: 'operator_intervention',
      type: 'Capability',
      name: 'Operator Intervention Fallback',
      description: 'Manual override system for edge-cases or failures',
      systemGroup: 'fleet_comms',
      capability: 'Remote Teleoperation',
      kind: 'heuristic',
      strength: 'strongly_recommended',
      gains: [
        'Handles unknown unknowns gracefully',
        'Provides legal and operational accountability'
      ],
      costs: [
        'Requires reliable, low-latency teleoperation link',
        'Introduces human-in-the-loop latency'
      ],
      alternatives: [
        {
          id: 'fully_autonomous',
          reasonRejected: 'Too high risk for most current regulatory frameworks',
          whenItWins: 'When system is proven 100% reliable or operates in constrained environments'
        }
      ],
      invalidWhen: [
        'System operates too quickly for human intervention to be meaningful'
      ],
      drivers: {
        [ArchitectureDriver.Safety]: 0.90,
        [ArchitectureDriver.Compliance]: 0.85
      },
      authorities: {
        [DecisionContext.FleetOps]: 0.90,
        [DecisionContext.SafetyControl]: 0.80
      },
      score: (model) => model.criticality === 'safety_critical' ? 90 : 20
    }],
    ['cloud_first_blocker', {
      id: 'cloud_first_blocker',
      type: 'Constraint',
      name: 'Offline-First Mandatory Constraint',
      description: 'Safety critical systems cannot rely exclusively on the cloud for real-time decisions',
      systemGroup: 'edge_runtime',
      capability: 'Local Autonomy',
      kind: 'rule',
      strength: 'critical',
      gains: [
        'Guaranteed decision latency',
        'Immune to network partitions and cloud outages'
      ],
      costs: [
        'Requires substantial edge compute capabilities',
        'Complicates software updates and fleet management'
      ],
      alternatives: [],
      invalidWhen: [
        'System has guaranteed ultra-low latency connection (e.g. factory floor private 5G) AND fail-safe state is easily reachable'
      ],
      drivers: {
        [ArchitectureDriver.Latency]: 0.90,
        [ArchitectureDriver.Safety]: 1.0,
        [ArchitectureDriver.Reliability]: 1.0
      },
      authorities: {
        [DecisionContext.Compute]: 0.90,
        [DecisionContext.SafetyControl]: 1.0
      },
      score: (model) => model.offlineRequirements === 'full' || model.criticality === 'safety_critical' ? 100 : 0
    }]
  ]),
  edges: [
    {
      sourceId: 'degraded_ops',
      targetId: 'watchdogs',
      type: 'requires',
      strength: 'mandatory'
    },
    {
      sourceId: 'degraded_ops',
      targetId: 'operator_intervention',
      type: 'recommends',
      strength: 'optional'
    },
    {
      sourceId: 'cloud_first_blocker',
      targetId: 'degraded_ops',
      type: 'enables',
      strength: 'mandatory'
    }
  ]
};
