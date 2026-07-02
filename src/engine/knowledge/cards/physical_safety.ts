import { DecisionGraph, DecisionNode, DecisionContext, ArchitectureDriver } from '../graph';
import { StartupModel } from '../../models/startup';

export const physicalSafetyGraph: DecisionGraph = {
  nodes: new Map<string, DecisionNode>([
    ['emergency_stop', {
      id: 'emergency_stop',
      type: 'Capability',
      name: 'Emergency Stop (E-Stop)',
      description: 'Hardware or software mechanism to immediately halt physical motion and cut power to actuators.',
      systemGroup: 'safety_systems',
      capability: 'physical_safety',
      kind: 'rule',
      strength: 'critical',
      gains: [
        'Prevents catastrophic physical harm to humans and environment',
        'Satisfies base safety compliance for physical systems'
      ],
      costs: [
        'Requires hardwired logic or dedicated real-time path',
        'Can cause equipment wear if triggered abruptly'
      ],
      alternatives: [
        { 
          id: 'soft_stop', 
          reasonRejected: 'Not sufficient for life-safety critical scenarios where immediate halt is legally and morally required.' 
        }
      ],
      invalidWhen: ['System has no moving physical parts'],
      drivers: {
        [ArchitectureDriver.Safety]: 1.0,
        [ArchitectureDriver.Compliance]: 0.9
      },
      authorities: {
        [DecisionContext.SafetyControl]: 1.0
      },
      score: (model: StartupModel) => model.criticality === 'safety_critical' ? 100 : 0
    }],
    ['human_override', {
      id: 'human_override',
      type: 'Capability',
      name: 'Human Teleop / Override',
      description: 'Allows a human operator to take over control of the physical system in edge cases.',
      systemGroup: 'fleet_comms',
      capability: 'remote_control',
      kind: 'heuristic',
      strength: 'strongly_recommended',
      gains: [
        'Provides a reliable fallback for complex edge cases AI cannot handle',
        'Improves user trust, accountability, and system adoption'
      ],
      costs: [
        'Requires ultra-low latency video and control link',
        'Security risk if communication is not properly authenticated and encrypted'
      ],
      alternatives: [],
      invalidWhen: ['Fully disconnected environments where remote telemetry is impossible'],
      drivers: {
        [ArchitectureDriver.Reliability]: 0.8,
        [ArchitectureDriver.Safety]: 0.9,
        [ArchitectureDriver.Latency]: 0.7
      },
      authorities: {
        [DecisionContext.FleetOps]: 0.9,
        [DecisionContext.SafetyControl]: 0.8
      },
      score: (model: StartupModel) => (model.latencyTolerance === 'ultra_low' && model.criticality === 'safety_critical') ? 85 : 30
    }],
    ['safe_state_machine', {
      id: 'safe_state_machine',
      type: 'Implementation',
      name: 'Verifiable Safe State Machine',
      description: 'A formally verifiable state machine ensuring the system can only transition to known safe states during anomalies.',
      systemGroup: 'safety_systems',
      capability: 'logic_verification',
      kind: 'rule',
      strength: 'critical',
      gains: [
        'Deterministic behavior under failure conditions',
        'Easier to audit for strict safety compliance'
      ],
      costs: [
        'Rigid design process that slows down development velocity',
        'Harder to iterate quickly compared to standard logic'
      ],
      alternatives: [
        { 
          id: 'ai_planner', 
          reasonRejected: 'Nondeterministic behavior is unacceptable for core safety loops.' 
        }
      ],
      invalidWhen: ['System has no physical actuators or critical state transitions'],
      drivers: {
        [ArchitectureDriver.Safety]: 1.0,
        [ArchitectureDriver.Reliability]: 0.9,
        [ArchitectureDriver.Maintainability]: 0.6
      },
      authorities: {
        [DecisionContext.SafetyControl]: 0.95
      },
      score: (model: StartupModel) => model.criticality === 'safety_critical' ? 95 : 10
    }],
    ['collision_avoidance', {
      id: 'collision_avoidance',
      type: 'Capability',
      name: 'Collision Avoidance System',
      description: 'Real-time obstacle detection and automated path adjustment to prevent physical impacts.',
      systemGroup: 'edge_runtime',
      capability: 'spatial_awareness',
      kind: 'heuristic',
      strength: 'critical',
      gains: [
        'Prevents damage to equipment, environment, and personnel',
        'Enables safe autonomous movement in dynamic areas'
      ],
      costs: [
        'High compute requirement at the edge',
        'Requires complex sensor fusion (e.g., Lidar, Depth Cameras)'
      ],
      alternatives: [
        { 
          id: 'fixed_path_following', 
          reasonRejected: 'Only suitable for completely controlled static environments.', 
          whenItWins: 'AGVs operating in fenced, human-free warehouse zones.' 
        }
      ],
      invalidWhen: ['Stationary equipment without manipulators'],
      drivers: {
        [ArchitectureDriver.Safety]: 1.0,
        [ArchitectureDriver.Latency]: 0.9
      },
      authorities: {
        [DecisionContext.Navigation]: 1.0,
        [DecisionContext.SafetyControl]: 0.8
      },
      score: (model: StartupModel) => model.capabilities?.some((a: any) => a.name === 'robotics' || a.name === 'autonomous_vehicle') ? 90 : 0
    }],
    ['elevator_reservation', {
      id: 'elevator_reservation',
      type: 'Capability',
      name: 'Elevator/Choke-point Reservation',
      description: 'Protocol to reserve shared infrastructure like elevators or narrow hallways to prevent robot deadlocks.',
      systemGroup: 'fleet_comms',
      capability: 'fleet_orchestration',
      kind: 'rule',
      strength: 'recommended',
      gains: [
        'Prevents physical deadlocks in confined spaces',
        'Optimizes overall fleet throughput'
      ],
      costs: [
        'Requires a centralized broker or complex peer-to-peer negotiation protocol',
        'Relies on reliable network connectivity in historically poor-coverage areas (like elevators)'
      ],
      alternatives: [
        { 
          id: 'reactive_yielding', 
          reasonRejected: 'Can lead to livelocks and significant delays in tight spaces with multiple agents.' 
        }
      ],
      invalidWhen: ['Single robot deployments', 'Open outdoor environments with no choke points'],
      drivers: {
        [ArchitectureDriver.Scalability]: 0.8,
        [ArchitectureDriver.Availability]: 0.7
      },
      authorities: {
        [DecisionContext.FleetOps]: 0.85
      },
      score: (model: StartupModel) => model.scale !== 'mvp' ? 70 : 20
    }]
  ]),
  edges: [
    {
      sourceId: 'collision_avoidance',
      targetId: 'emergency_stop',
      type: 'requires',
      strength: 'mandatory'
    },
    {
      sourceId: 'safe_state_machine',
      targetId: 'emergency_stop',
      type: 'enables',
      strength: 'mandatory'
    },
    {
      sourceId: 'human_override',
      targetId: 'safe_state_machine',
      type: 'requires',
      strength: 'mandatory'
    },
    {
      sourceId: 'elevator_reservation',
      targetId: 'collision_avoidance',
      type: 'enhances',
      strength: 'optional'
    }
  ]
};
