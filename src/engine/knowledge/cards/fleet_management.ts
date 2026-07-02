import { DecisionGraph, DecisionNode, DecisionContext, ArchitectureDriver } from '../graph';
import { StartupModel } from '../../models/startup';

export const fleetManagementGraph: DecisionGraph = {
  nodes: new Map<string, DecisionNode>([
    ['fleet_manager', {
      id: 'fleet_manager',
      type: 'Capability',
      name: 'Central Fleet Manager',
      description: 'Centralized administration system for tracking and orchestrating geographically distributed devices.',
      systemGroup: 'cloud_platform',
      capability: 'Fleet Control',
      kind: 'rule',
      strength: 'critical',
      gains: [
        'Single pane of glass for all devices',
        'Simplifies operational interventions'
      ],
      costs: [
        'High development and maintenance effort',
        'Can become a single point of failure without proper HA'
      ],
      alternatives: [],
      invalidWhen: ['model.scale === "mvp"'],
      drivers: {
        [ArchitectureDriver.Maintainability]: 0.9,
        [ArchitectureDriver.Scalability]: 0.8
      },
      authorities: {
        [DecisionContext.FleetOps]: 1.0
      },
      score: (model: StartupModel) => model.capabilities.some(a => a.name === 'robotics' || a.name === 'iot') ? 95 : 10
    }],
    ['device_registry', {
      id: 'device_registry',
      type: 'Implementation',
      name: 'Device Registry',
      description: 'Secure registry containing device identities, cryptographic keys, and current expected state (digital twin).',
      systemGroup: 'fleet_comms',
      capability: 'Device Identity',
      kind: 'fact',
      strength: 'critical',
      gains: [
        'Secure authentication per device',
        'Enables fine-grained access control',
        'State synchronization between cloud and edge'
      ],
      costs: [
        'Key rotation and lifecycle management complexity',
        'Storage overhead for device twins'
      ],
      alternatives: [],
      invalidWhen: [],
      drivers: {
        [ArchitectureDriver.Security]: 1.0,
        [ArchitectureDriver.Reliability]: 0.8
      },
      authorities: {
        [DecisionContext.Identity]: 0.9,
        [DecisionContext.FleetOps]: 0.8
      },
      score: (model: StartupModel) => model.capabilities.some(a => a.name === 'robotics' || a.name === 'iot') ? 100 : 0
    }],
    ['mqtt_broker', {
      id: 'mqtt_broker',
      type: 'Implementation',
      name: 'MQTT Broker',
      description: 'Lightweight pub/sub message broker optimized for high-latency, low-bandwidth, and unreliable networks.',
      systemGroup: 'fleet_comms',
      capability: 'Edge-Cloud Messaging',
      kind: 'judgment',
      strength: 'strongly_recommended',
      gains: [
        'Low network overhead',
        'Built-in QoS levels for delivery guarantees',
        'Excellent library support for embedded devices'
      ],
      costs: [
        'Requires dedicated infrastructure or managed service',
        'Complex to scale horizontally compared to HTTP'
      ],
      alternatives: [
        {
          id: 'http_polling',
          reasonRejected: 'Too much overhead and battery drain for large fleets.',
          whenItWins: 'Extremely small scale or environments blocking non-HTTP traffic.'
        }
      ],
      invalidWhen: ['model.latencyTolerance === "high"'],
      drivers: {
        [ArchitectureDriver.Latency]: 0.9,
        [ArchitectureDriver.Reliability]: 0.8,
        [ArchitectureDriver.Scalability]: 0.7
      },
      authorities: {
        [DecisionContext.Messaging]: 1.0,
        [DecisionContext.FleetOps]: 0.9
      },
      score: (model: StartupModel) => model.capabilities.some(a => a.name === 'robotics' || a.name === 'iot') ? 90 : 15
    }],
    ['ota_rollout', {
      id: 'ota_rollout',
      type: 'Capability',
      name: 'Over-The-Air (OTA) Updates',
      description: 'Infrastructure to deliver, verify, and apply software and firmware updates remotely.',
      systemGroup: 'fleet_comms',
      capability: 'Software Distribution',
      kind: 'rule',
      strength: 'critical',
      gains: [
        'Rapid deployment of critical patches',
        'Eliminates physical maintenance trips'
      ],
      costs: [
        'Risk of bricking devices if update fails or loses power',
        'High bandwidth consumption'
      ],
      alternatives: [],
      invalidWhen: [],
      drivers: {
        [ArchitectureDriver.Maintainability]: 1.0,
        [ArchitectureDriver.Security]: 0.9
      },
      authorities: {
        [DecisionContext.Deployment]: 0.9,
        [DecisionContext.FleetOps]: 0.9
      },
      score: (model: StartupModel) => model.capabilities.some(a => a.name === 'robotics' || a.name === 'iot') ? 95 : 5
    }],
    ['canary_firmware', {
      id: 'canary_firmware',
      type: 'Risk',
      name: 'Canary Firmware Rollouts',
      description: 'Staged deployment of OTA updates to a small subset of the fleet before broad distribution.',
      systemGroup: 'fleet_comms',
      capability: 'Safe Deployment',
      kind: 'heuristic',
      strength: 'strongly_recommended',
      gains: [
        'Limits blast radius of defective firmware',
        'Gathers real-world performance metrics early'
      ],
      costs: [
        'Increases deployment pipeline complexity',
        'Requires sophisticated fleet segmentation logic'
      ],
      alternatives: [],
      invalidWhen: ['model.scale === "mvp"'],
      drivers: {
        [ArchitectureDriver.Reliability]: 0.9,
        [ArchitectureDriver.Safety]: 0.8
      },
      authorities: {
        [DecisionContext.Deployment]: 0.8,
        [DecisionContext.SafetyControl]: 0.7
      },
      score: (model: StartupModel) => (model.scale === 'massive' && model.capabilities.some(a => a.name === 'robotics' || a.name === 'iot')) ? 90 : 40
    }],
    ['fleet_health_dashboard', {
      id: 'fleet_health_dashboard',
      type: 'Implementation',
      name: 'Fleet Health Dashboard',
      description: 'Real-time observability interface mapping out device connectivity, battery levels, and fault states.',
      systemGroup: 'observability',
      capability: 'Fleet Telemetry',
      kind: 'rule',
      strength: 'recommended',
      gains: [
        'Immediate visibility into systemic failures',
        'Improved support and troubleshooting capabilities'
      ],
      costs: [
        'Significant telemetry storage costs',
        'Custom frontend engineering required'
      ],
      alternatives: [],
      invalidWhen: [],
      drivers: {
        [ArchitectureDriver.Maintainability]: 0.8,
        [ArchitectureDriver.Reliability]: 0.7
      },
      authorities: {
        [DecisionContext.Observability]: 0.9,
        [DecisionContext.FleetOps]: 0.8
      },
      score: (model: StartupModel) => model.capabilities.some(a => a.name === 'robotics' || a.name === 'iot') ? 85 : 20
    }]
  ]),
  edges: [
    {
      sourceId: 'fleet_manager',
      targetId: 'device_registry',
      type: 'requires',
      strength: 'mandatory'
    },
    {
      sourceId: 'fleet_manager',
      targetId: 'ota_rollout',
      type: 'requires',
      strength: 'mandatory'
    },
    {
      sourceId: 'ota_rollout',
      targetId: 'canary_firmware',
      type: 'recommends',
      strength: 'optional'
    },
    {
      sourceId: 'fleet_manager',
      targetId: 'fleet_health_dashboard',
      type: 'recommends',
      strength: 'optional'
    },
    {
      sourceId: 'fleet_manager',
      targetId: 'mqtt_broker',
      type: 'requires',
      strength: 'mandatory'
    }
  ]
};
