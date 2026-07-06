import { ArchitectureInput } from '../../src/engine/types';

export interface TestCase {
  name: string;
  category: 'Explicit' | 'Implicit' | 'Conflicting' | 'Misleading';
  input: Partial<ArchitectureInput>;
  assertions: {
    expectedCapabilities?: string[];
    mustActivate: string[];
    mustSuppress: string[];
  };
}

export const corpus: TestCase[] = [
  // --- EXPLICIT ---
  {
    name: 'E-commerce with standard payments',
    category: 'Explicit',
    input: {
      projectIdea: 'A standard e-commerce store selling shoes. We need user accounts, a shopping cart, and Stripe for checkout.',
      industryContexts: ['ecommerce'],
      capabilities: [
        { id: 'relational_storage', name: 'Relational', score: 90, source: 'llm', evidence: [] },
        { id: 'split_payments', name: 'split_payments', score: 100, source: 'llm', evidence: [] }
      ]
    },
    assertions: {
      mustActivate: ['stripe_connect'],
      mustSuppress: ['mqtt_broker', 'ros2']
    }
  },
  {
    name: 'Hospital robot navigation',
    category: 'Explicit',
    input: {
      projectIdea: 'An autonomous robot moving through hospital corridors carrying medicine.',
      industryContexts: ['robotics', 'healthcare'],
      capabilities: [
        { id: 'coordination.robot', name: 'coordination.robot', score: 100, source: 'llm', evidence: [] },
        { id: 'vision.localization', name: 'Localization', score: 100, source: 'llm', evidence: [] }
      ]
    },
    assertions: {
      mustActivate: ['ros2'],
      mustSuppress: ['stripe_connect']
    }
  },
  {
    name: 'Offline field worker app',
    category: 'Explicit',
    input: {
      projectIdea: 'App for oil rig inspectors who are offline for weeks at a time.',
      industryContexts: ['other'],
      capabilities: [
        { id: 'offline_sync', name: 'Offline', score: 100, source: 'llm', evidence: [] }
      ],
      offlineRequirements: 'full'
    },
    assertions: {
      mustActivate: [],
      mustSuppress: ['stripe_connect']
    }
  },
  {
    name: 'High-frequency trading',
    category: 'Explicit',
    input: {
      projectIdea: 'Crypto arbitrage trading engine',
      industryContexts: ['fintech'],
      capabilities: [
        { id: 'ultra_low_latency', name: 'Low Latency', score: 100, source: 'llm', evidence: [] },
        { id: 'financial_critical', name: 'Financial', score: 100, source: 'llm', evidence: [] }
      ],
      latencyTolerance: 'ultra_low'
    },
    assertions: {
      mustActivate: [], // Depends on specific graph nodes
      mustSuppress: ['mqtt_broker', 'ros2', 'stripe_connect']
    }
  },
  {
    name: 'AI image pipeline',
    category: 'Explicit',
    input: {
      projectIdea: 'Generate images using stable diffusion on demand.',
      industryContexts: ['ai_saas'],
      capabilities: [
        { id: 'gpu_compute', name: 'GPU', score: 100, source: 'llm', evidence: [] },
        { id: 'object_storage', name: 'Storage', score: 90, source: 'llm', evidence: [] },
        { id: 'distributed_tracing', name: 'Tracing', score: 80, source: 'llm', evidence: [] }
      ]
    },
    assertions: {
      mustActivate: ['opentelemetry'],
      mustSuppress: ['ros2']
    }
  },

  // --- IMPLICIT ---
  {
    name: 'High throughput clicks',
    category: 'Implicit',
    input: {
      projectIdea: 'Process millions of clicks per second for an ad network.',
      industryContexts: ['ad_tech'],
      capabilities: [
        { id: 'high_throughput', name: 'Throughput', score: 95, source: 'llm', evidence: [] }
      ],
      scale: 'massive'
    },
    assertions: {
      mustActivate: [],
      mustSuppress: ['stripe_connect']
    }
  },
  {
    name: 'Internal CEO dashboard',
    category: 'Implicit',
    input: {
      projectIdea: 'Internal dashboard for 5 executives to view monthly sales.',
      industryContexts: ['internal_tool'],
      capabilities: [
        { id: 'relational_storage', name: 'Relational', score: 80, source: 'llm', evidence: [] }
      ],
      scale: 'mvp',
      expectedUsers: 5
    },
    assertions: {
      mustActivate: [],
      mustSuppress: ['ros2'] // Should suppress over-engineering
    }
  },
  {
    name: 'Streaming live video',
    category: 'Implicit',
    input: {
      projectIdea: 'Live video streaming to 1M users.',
      industryContexts: ['video_streaming'],
      capabilities: [
        { id: 'video_streaming', name: 'Video', score: 100, source: 'llm', evidence: [] },
        { id: 'cdn_distribution', name: 'CDN', score: 100, source: 'llm', evidence: [] }
      ]
    },
    assertions: {
      mustActivate: [],
      mustSuppress: ['stripe_connect']
    }
  },
  {
    name: 'IoT device tracking',
    category: 'Implicit',
    input: {
      projectIdea: 'Track GPS coordinates of 10,000 delivery trucks.',
      industryContexts: ['iot'],
      capabilities: [
        { id: 'fleet_management', name: 'Fleet', score: 100, source: 'llm', evidence: [] },
        { id: 'messaging.telemetry.device', name: 'Telemetry', score: 100, source: 'llm', evidence: [] }
      ]
    },
    assertions: {
      mustActivate: ['mqtt_broker'],
      mustSuppress: ['stripe_connect']
    }
  },
  {
    name: 'Decentralized voting',
    category: 'Implicit',
    input: {
      projectIdea: 'Cryptographic verifiable voting system.',
      industryContexts: ['other'],
      capabilities: [
        { id: 'cryptography', name: 'Crypto', score: 100, source: 'llm', evidence: [] },
        { id: 'immutable_ledger', name: 'Ledger', score: 100, source: 'llm', evidence: [] }
      ],
      criticality: 'safety_critical'
    },
    assertions: {
      mustActivate: [], // We don't have a blockchain node yet, but check suppression
      mustSuppress: ['ros2']
    }
  },

  // --- CONFLICTING ---
  {
    name: 'Low budget HFT',
    category: 'Conflicting',
    input: {
      projectIdea: 'Ultra low latency trading engine built for $50.',
      industryContexts: ['fintech'],
      capabilities: [
        { id: 'ultra_low_latency', name: 'Latency', score: 100, source: 'llm', evidence: [] }
      ],
      budget: 'bootstrap'
    },
    assertions: {
      mustActivate: [],
      mustSuppress: [] // Tests engine handling of constraints
    }
  },
  {
    name: 'CRDT vs SQLite',
    category: 'Conflicting',
    input: {
      projectIdea: 'Local only app but with real-time multi-device collaboration.',
      capabilities: [
        { id: 'offline_sync', name: 'Offline', score: 100, source: 'llm', evidence: [] },
        { id: 'realtime_collaboration', name: 'Realtime', score: 100, source: 'llm', evidence: [] }
      ]
    },
    assertions: {
      mustActivate: [],
      mustSuppress: []
    }
  },
  {
    name: 'Blockchain HFT',
    category: 'Conflicting',
    input: {
      projectIdea: 'HFT on Ethereum mainnet.',
      capabilities: [
        { id: 'ultra_low_latency', name: 'Latency', score: 100, source: 'llm', evidence: [] },
        { id: 'immutable_ledger', name: 'Ledger', score: 100, source: 'llm', evidence: [] }
      ]
    },
    assertions: {
      mustActivate: [],
      mustSuppress: []
    }
  },
  {
    name: 'HIPAA public AI',
    category: 'Conflicting',
    input: {
      projectIdea: 'Send patient data to public ChatGPT.',
      capabilities: [
        { id: 'llm_inference', name: 'LLM', score: 100, source: 'llm', evidence: [] }
      ],
      complianceLevel: 'hipaa'
    },
    assertions: {
      mustActivate: [],
      mustSuppress: []
    }
  },
  {
    name: 'Massive MMO in Rails',
    category: 'Conflicting',
    input: {
      projectIdea: '10 million concurrent player MMO built in Ruby on Rails.',
      capabilities: [
        { id: 'realtime_gaming', name: 'Gaming', score: 100, source: 'llm', evidence: [] }
      ],
      scale: 'massive'
    },
    assertions: {
      mustActivate: [],
      mustSuppress: []
    }
  },

  // --- MISLEADING ---
  {
    name: 'Kafka for Todo App',
    category: 'Misleading',
    input: {
      projectIdea: 'A personal todo list app. We want to use Apache Kafka for events.',
      capabilities: [
        { id: 'relational_storage', name: 'Relational', score: 80, source: 'llm', evidence: [] }
      ],
      scale: 'mvp'
    },
    assertions: {
      mustActivate: [],
      mustSuppress: [] // Over-engineering blocked
    }
  },
  {
    name: 'K8s for personal blog',
    category: 'Misleading',
    input: {
      projectIdea: 'My personal blog, deployed on Kubernetes for scale.',
      capabilities: [
        { id: 'static_hosting', name: 'Static', score: 100, source: 'llm', evidence: [] }
      ],
      scale: 'mvp'
    },
    assertions: {
      mustActivate: [],
      mustSuppress: []
    }
  },
  {
    name: 'Microservices for marketing site',
    category: 'Misleading',
    input: {
      projectIdea: '1-page marketing site using microservices.',
      capabilities: [
        { id: 'static_hosting', name: 'Static', score: 100, source: 'llm', evidence: [] }
      ]
    },
    assertions: {
      mustActivate: [],
      mustSuppress: []
    }
  },
  {
    name: 'MQTT for web dashboard',
    category: 'Misleading',
    input: {
      projectIdea: 'Web dashboard updating via MQTT.',
      capabilities: [
        { id: 'realtime_web', name: 'WebSockets', score: 100, source: 'llm', evidence: [] }
      ]
    },
    assertions: {
      mustActivate: [],
      mustSuppress: ['mqtt_broker']
    }
  },
  {
    name: 'ROS2 for e-commerce',
    category: 'Misleading',
    input: {
      projectIdea: 'Using ROS2 to pass messages in our e-commerce frontend.',
      capabilities: [
        { id: 'web_frontend', name: 'Web', score: 100, source: 'llm', evidence: [] }
      ]
    },
    assertions: {
      mustActivate: [],
      mustSuppress: ['ros2']
    }
  }
];
