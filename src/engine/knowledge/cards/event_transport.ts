import { DecisionGraph, ArchitectureDriver } from '../graph';

export const eventTransportGraph: DecisionGraph = {
  nodes: new Map([
    [
      'kafka',
      {
        id: 'kafka',
        type: 'Implementation',
        name: 'Apache Kafka',
        description: 'High-throughput distributed event streaming',
        systemGroup: 'event_transport',
        engineeringComplexity: 'High',
        operationalCost: 'High',
        winsWhen: ['Massive throughput', 'Event replay required', 'Event sourcing architecture'],
        losesWhen: ['Simple worker queues', 'Small team without data engineers'],
        antiPatterns: [],
        counterExamples: [],
        migrationPath: [],
        failureModes: [],
        changesWhen: [],
        principles: ['design_for_scale'],
        eligibility: {
          anyOf: ['communication.event_streaming']
        },
        applicability: {
          prefersCapabilities: ['communication.event_streaming']
        },
        capability: 'event_streaming',
        drivers: {
          [ArchitectureDriver.Scalability]: 1.0,
          [ArchitectureDriver.Reliability]: 1.0,
          [ArchitectureDriver.Cost]: -0.5,
          [ArchitectureDriver.DeveloperVelocity]: -0.5
        },
        score: () => 65
      }
    ],
    [
      'rabbitmq',
      {
        id: 'rabbitmq',
        type: 'Implementation',
        name: 'RabbitMQ',
        description: 'Advanced message queuing with complex routing',
        systemGroup: 'event_transport',
        engineeringComplexity: 'Medium',
        operationalCost: 'Medium',
        winsWhen: ['Complex topic/header routing', 'AMQP standard required', 'Legacy enterprise integration'],
        losesWhen: ['High-volume log aggregation', 'Need permanent event replay'],
        antiPatterns: [],
        counterExamples: [],
        migrationPath: [],
        failureModes: [],
        changesWhen: [],
        principles: ['event_driven_by_default'],
        eligibility: {
          anyOf: ['communication.event_streaming']
        },
        applicability: {
          prefersCapabilities: ['communication.event_streaming']
        },
        capability: 'event_streaming',
        drivers: {
          [ArchitectureDriver.Reliability]: 0.9,
          [ArchitectureDriver.DeveloperVelocity]: 0.6
        },
        score: () => 68
      }
    ],
    [
      'aws_sqs_sns',
      {
        id: 'aws_sqs_sns',
        type: 'Implementation',
        name: 'AWS SQS & SNS',
        description: 'Fully managed pub/sub and message queues',
        systemGroup: 'event_transport',
        engineeringComplexity: 'Low',
        operationalCost: 'Low',
        winsWhen: ['AWS-native infrastructure', 'Simple worker queues', 'Serverless architectures'],
        losesWhen: ['Multi-cloud required', 'Strict ordering needed across massive scale (use Kafka)'],
        antiPatterns: [],
        counterExamples: [],
        migrationPath: [],
        failureModes: [],
        changesWhen: [],
        principles: ['cloud_native_integration', 'event_driven_by_default'],
        eligibility: {
          anyOf: ['communication.event_streaming']
        },
        applicability: {
          prefersCapabilities: ['communication.event_streaming']
        },
        capability: 'event_streaming',
        drivers: {
          [ArchitectureDriver.DeveloperVelocity]: 1.0,
          [ArchitectureDriver.Reliability]: 0.9,
          [ArchitectureDriver.Cost]: 0.8
        },
        score: () => 75
      }
    ],
    [
      'nats',
      {
        id: 'nats',
        type: 'Implementation',
        name: 'NATS',
        description: 'High-performance, ultra-low latency messaging system',
        systemGroup: 'event_transport',
        engineeringComplexity: 'Medium',
        operationalCost: 'Low',
        winsWhen: ['Ultra-low latency microservices', 'IoT edge/cloud messaging', 'Multi-tenant secure comms'],
        losesWhen: ['Strict enterprise standard requirements (like AMQP)'],
        antiPatterns: [],
        counterExamples: [],
        migrationPath: [],
        failureModes: [],
        changesWhen: [],
        principles: ['locality_beats_latency'],
        eligibility: {
          anyOf: ['communication.event_streaming', 'performance.ultra_low_latency']
        },
        applicability: {
          prefersCapabilities: ['communication.event_streaming', 'performance.ultra_low_latency']
        },
        capability: 'event_streaming',
        drivers: {
          [ArchitectureDriver.Latency]: 1.0,
          [ArchitectureDriver.Scalability]: 0.8,
          [ArchitectureDriver.DeveloperVelocity]: 0.8
        },
        score: () => 70
      }
    ]
  ] as any),
  edges: []
};
