import { DecisionGraph, DecisionContext, ArchitectureDriver, DecisionNode } from '../graph';

const cvPipelineCapability: DecisionNode = {
  id: 'cv_pipeline_capability',
  type: 'Capability',
  name: 'Computer Vision Pipeline',
  description: 'Core capability for ingesting, processing, and analyzing visual data streams.',
  systemGroup: 'cv_pipeline',
  kind: 'fact',
  strength: 'strongly_recommended',
  gains: [
    'Enables intelligent visual processing',
    'Provides core value proposition for robotics and vision-based AI systems'
  ],
  costs: [
    'High compute and memory requirements',
    'Requires specialized machine learning engineering talent'
  ],
  drivers: {
    [ArchitectureDriver.DeveloperVelocity]: -0.5,
    [ArchitectureDriver.Scalability]: 0.8
  },
  authorities: {
    [DecisionContext.Compute]: 0.8
  },
  score: (model) => model.capabilities.some(d => d.name === 'ai_saas' || d.name === 'robotics') ? 100 : 0
};

const gpuInference: DecisionNode = {
  id: 'gpu_inference',
  type: 'Implementation',
  name: 'GPU Inference Services',
  description: 'Hardware acceleration for processing visual data',
  systemGroup: 'cv_pipeline',
  capability: 'cv_pipeline_capability',
  kind: 'rule',
  strength: 'critical',
  gains: [
    'Massively faster inference for deep learning models',
    'Enables real-time processing of video streams'
  ],
  costs: [
    'High operational cost compared to CPU',
    'Cloud provider availability constraints for specific GPU models'
  ],
  alternatives: [
    {
      id: 'cpu_inference',
      reasonRejected: 'Too slow for real-time video processing requirements',
      whenItWins: 'Low volume batch processing or using heavily quantized/lightweight models'
    }
  ],
  invalidWhen: ['model.budget === "bootstrap"'],
  drivers: {
    [ArchitectureDriver.Latency]: 0.9,
    [ArchitectureDriver.Cost]: -0.8
  },
  authorities: {
    [DecisionContext.Compute]: 0.95
  },
  score: (model) => model.capabilities.some(d => d.name === 'ai_saas' || d.name === 'robotics') ? 80 : 10
};

const slam: DecisionNode = {
  id: 'slam',
  type: 'Implementation',
  name: 'SLAM Infrastructure',
  description: 'Simultaneous Localization and Mapping',
  systemGroup: 'cv_pipeline',
  capability: 'cv_pipeline_capability',
  kind: 'judgment',
  strength: 'recommended',
  gains: [
    'Enables autonomous spatial awareness and navigation',
    'Provides real-time environment mapping'
  ],
  costs: [
    'Extremely complex algorithmically to tune and maintain',
    'High edge compute requirements for low-latency operation'
  ],
  alternatives: [
    {
      id: 'gps_only',
      reasonRejected: 'Insufficient accuracy for indoor or precise local navigation',
      whenItWins: 'Outdoor navigation with a high tolerance for positioning error'
    }
  ],
  invalidWhen: ['model.latencyTolerance === "high"'],
  drivers: {
    [ArchitectureDriver.Reliability]: 0.7,
    [ArchitectureDriver.Latency]: 0.9
  },
  authorities: {
    [DecisionContext.Navigation]: 0.90
  },
  score: (model) => model.capabilities.some(d => d.name === 'robotics') ? 95 : 5
};

const objectStorage: DecisionNode = {
  id: 'object_storage',
  type: 'Implementation',
  name: 'Object Storage for Sensor Recordings',
  description: 'Blob storage for massive visual telemetry logs',
  systemGroup: 'data_pipeline',
  capability: 'telemetry_storage',
  kind: 'rule',
  strength: 'strongly_recommended',
  gains: [
    'Highly scalable storage for large binary files',
    'Cost-effective for high volume sensor data'
  ],
  costs: [
    'Higher latency than block storage',
    'Eventual consistency can complicate immediate read-after-write operations'
  ],
  alternatives: [
    {
      id: 'block_storage',
      reasonRejected: 'Prohibitively expensive for high-volume logs',
      whenItWins: 'Low volume data where high IOPS and performance are strictly required'
    }
  ],
  invalidWhen: [],
  drivers: {
    [ArchitectureDriver.Scalability]: 0.9,
    [ArchitectureDriver.Cost]: 0.8
  },
  authorities: {
    [DecisionContext.Storage]: 0.85
  },
  score: (model) => model.scale === 'massive' || model.capabilities.some(d => d.name === 'robotics') ? 80 : 30
};

export const computerVisionGraph: DecisionGraph = {
  nodes: new Map([
    [cvPipelineCapability.id, cvPipelineCapability],
    [gpuInference.id, gpuInference],
    [slam.id, slam],
    [objectStorage.id, objectStorage]
  ]),
  edges: [
    {
      sourceId: cvPipelineCapability.id,
      targetId: gpuInference.id,
      type: 'implementedBy',
      strength: 'mandatory'
    },
    {
      sourceId: cvPipelineCapability.id,
      targetId: slam.id,
      type: 'enables',
      strength: 'optional'
    },
    {
      sourceId: slam.id,
      targetId: gpuInference.id,
      type: 'requires',
      strength: 'mandatory'
    },
    {
      sourceId: slam.id,
      targetId: objectStorage.id,
      type: 'recommends',
      strength: 'optional'
    }
  ]
};
