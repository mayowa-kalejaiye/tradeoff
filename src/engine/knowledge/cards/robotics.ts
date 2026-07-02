import { 
  DecisionGraph, 
  DecisionContext, 
  ArchitectureDriver 
} from '../graph';
import { StartupModel } from '../../models/startup';

export const roboticsGraph: DecisionGraph = {
  nodes: new Map([
    ['ros2', {
      id: 'ros2',
      type: 'Implementation',
      name: 'ROS 2 (DDS)',
      description: 'Robot Operating System 2 for internal robot messaging, hardware abstraction, and path planning.',
      systemGroup: 'edge_runtime',
      capability: 'Reliable Robot Coordination',
      
      engineeringComplexity: 'High',
      operationalCost: 'Medium',
      
      winsWhen: [
        'Complex robot operations requiring standardized hardware abstraction.',
        'Deterministic message delivery is required for safety-critical loops.',
        'Need access to a massive ecosystem of pre-built navigation/vision algorithms.'
      ],
      losesWhen: [
        'Microcontroller-only or highly constrained edge environments.',
        'Simple robots that only need basic I/O and movement.'
      ],
      antiPatterns: [
        'Treating ROS2 as a WAN protocol (it is for local/LAN robotics, not cloud fleet management).',
        'Running ROS2 nodes over lossy WiFi without properly tuning DDS QoS profiles.'
      ],
      counterExamples: [],
      migrationPath: [
        'Custom TCP sockets',
        'ROS1 (EOL)',
        'ROS 2 (DDS)'
      ],
      failureModes: [
        {
          context: 'DDS Discovery Storm',
          symptoms: 'Nodes fail to discover each other on startup; network flooded with multicast traffic.',
          detection: 'Wireshark shows excessive RTPS multicast; ros2 node list hangs.',
          mitigation: 'Implement a FastDDS Discovery Server instead of simple multicast discovery.',
          recovery: 'Restart DDS daemon with statically configured peer lists.'
        },
        {
          context: 'QoS Mismatch',
          symptoms: 'Subscribers silently fail to receive messages from publishers.',
          detection: 'ros2 topic info shows publisher but no active subscriptions.',
          mitigation: 'Ensure publishers (e.g. sensor data) use BestEffort while critical control uses Reliable.',
          recovery: 'Reconfigure node QoS parameters and restart.'
        }
      ],
      scaleLimit: {
        breaksFirst: 'Network interface saturation due to uncompressed point clouds.',
        observableSymptom: 'Control loop latency spikes; missed deadlines.',
        mitigations: [
          'Filter and compress point clouds before publishing.',
          'Use zero-copy transport (e.g. iceoryx) for intra-process communication.',
          'Move heavy compute to a dedicated GPU node over PCIe.'
        ]
      },
      changesWhen: [
        'Moving to swarm robotics where standard DDS overhead per agent is too high.'
      ],
      principles: ['prefer_deterministic'], 
      
      drivers: {
        [ArchitectureDriver.Maintainability]: 0.8,
        [ArchitectureDriver.Reliability]: 0.9,
      },
      score: (model: StartupModel) => model.capabilities?.some(d => d.name === 'robotics') ? 95 : 5
    }],
    ['mqtt_fleet', {
      id: 'mqtt_fleet',
      type: 'Implementation',
      name: 'MQTT with Edge Buffering',
      description: 'Lightweight pub/sub protocol for robot-to-cloud telemetry and command dispatch.',
      systemGroup: 'fleet_communications',
      capability: 'Fleet Messaging',
      
      engineeringComplexity: 'Medium',
      operationalCost: 'Low',
      
      winsWhen: [
        'Robots disconnect frequently (hospital WiFi dead zones).',
        'Bandwidth is constrained or expensive.',
        'Asynchronous command delivery is acceptable.'
      ],
      losesWhen: [
        'Massive data streaming (e.g., streaming raw 4K video to the cloud).',
        'Complex stream processing and aggregation is required.'
      ],
      antiPatterns: [
        'Using REST polling for fleet command dispatch (drains battery, scales poorly).',
        'Publishing heavy payloads without compression.'
      ],
      counterExamples: [],
      migrationPath: [
        'REST API Polling',
        'WebSockets',
        'MQTT (QoS 1)'
      ],
      failureModes: [
        {
          context: 'Broker Connection Drop',
          symptoms: 'Robot appears offline in fleet manager but is physically operating.',
          detection: 'Missing LWT (Last Will and Testament) heartbeat.',
          mitigation: 'Implement local edge buffering (store-and-forward) for telemetry.',
          recovery: 'Replay buffered mission telemetry once connection is restored.'
        }
      ],
      scaleLimit: {
        breaksFirst: 'Central MQTT broker CPU saturation handling thousands of simultaneous reconnects.',
        observableSymptom: 'Publish latency increases dramatically; connections drop.',
        mitigations: [
          'Cluster the MQTT brokers.',
          'Bridge edge MQTT brokers to a central Kafka backbone for heavy lifting.',
          'Implement backoff-and-jitter on robot reconnect logic.'
        ]
      },
      changesWhen: [
        'Fleet size exceeds 100,000 active concurrent connections.'
      ],
      principles: ['offline_first'], 
      
      drivers: {
        [ArchitectureDriver.Reliability]: 0.95,
        [ArchitectureDriver.Latency]: 0.6,
      },
      score: (model: StartupModel) => (model.offlineRequirements !== 'none') ? 100 : 60
    }],
    ['custom_zmq', {
      id: 'custom_zmq',
      type: 'Implementation',
      name: 'Custom ZeroMQ Middleware',
      description: 'Barebones, high-performance messaging library without standard robotic message definitions.',
      systemGroup: 'edge_runtime',
      capability: 'Reliable Robot Coordination',
      
      engineeringComplexity: 'Medium',
      operationalCost: 'Low',
      
      winsWhen: [
        'Microcontroller-only robots or extreme resource constraints.',
        'Strictly point-to-point communication where DDS overhead is unacceptable.'
      ],
      losesWhen: [
        'Building complex autonomous systems requiring ecosystem packages (SLAM, Nav2).',
        'Team lacks the resources to reinvent message serialization and lifecycle management.'
      ],
      antiPatterns: [
        'Reinventing ROS2 from scratch using ZMQ out of "Not Invented Here" syndrome.'
      ],
      counterExamples: [],
      migrationPath: [],
      failureModes: [],
      changesWhen: [],
      principles: [], 
      
      drivers: {
        [ArchitectureDriver.Latency]: 0.9,
      },
      score: (model: StartupModel) => 30 // Usually loses to ROS2 for complex robotics
    }],
    ['edge_compute', {
      id: 'edge_compute',
      type: 'Implementation',
      name: 'Heavy Edge Compute (Jetson/GPU)',
      description: 'Processing heavy ML and navigation workloads locally on the robot to ensure autonomy when offline.',
      systemGroup: 'edge_runtime',
      capability: 'Local Processing',
      
      engineeringComplexity: 'High',
      operationalCost: 'High',
      
      winsWhen: [
        'Ultra-low latency required for control loops.',
        'System must remain autonomous during complete network failure.'
      ],
      losesWhen: [
        'Stationary cameras or systems without safety-critical real-time requirements.'
      ],
      antiPatterns: [
        'Cloud-first robotics: relying on the cloud for real-time obstacle avoidance.'
      ],
      counterExamples: [],
      migrationPath: [],
      failureModes: [
        {
          context: 'Thermal Throttling',
          symptoms: 'ML inference latency spikes unpredictably after 30 minutes of operation.',
          detection: 'Onboard temperature sensors report > 85C.',
          mitigation: 'Implement active cooling and dynamically degrade inference FPS when hot.',
          recovery: 'Transition to safe state and stop moving until cooled.'
        }
      ],
      scaleLimit: {
        breaksFirst: 'Power budget exceeded; battery drains too fast.',
        observableSymptom: 'Robot returns to dock prematurely.',
        mitigations: [
          'Quantize ML models to INT8.',
          'Use dedicated hardware accelerators (TPU/NPU) instead of generic GPUs.'
        ]
      },
      changesWhen: [],
      principles: ['move_compute_to_edge'], 
      
      drivers: {
        [ArchitectureDriver.Latency]: 0.95,
        [ArchitectureDriver.Reliability]: 0.9,
      },
      score: (model: StartupModel) => (model.offlineRequirements !== 'none') ? 100 : 20
    }]
  ] as any), // Type assertion to bypass strict generic typing of DecisionGraph mapping in V3 vs V5
  edges: [
    {
      sourceId: 'ros2',
      targetId: 'edge_compute',
      type: 'requires',
      strength: 'mandatory'
    }
  ]
};
