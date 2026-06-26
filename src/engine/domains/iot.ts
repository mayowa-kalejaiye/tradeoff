import { ArchitectureInput, EngineResponse, StackComponent, DeferredDecision, ArchitectureDebt, ArchitectureChallenge, BusinessRisk, BlueprintCategory } from '../types';

export function handleIoT(input: ArchitectureInput): EngineResponse | null {
  const isIoT = input.archetypes.some(a => a.name === 'iot_platform') || 
    input.projectIdea.toLowerCase().match(/(iot|hardware|sensor|telemetry|fleet tracking|mqtt|device management|edge compute|raspberry pi|arduino)/);

  if (!isIoT) {
    return null;
  }

  const promptText = input.projectIdea.toLowerCase();
  
  // Principal Engineer Pushback
  const mentionsFrequency = promptText.match(/(second|minute|hour|hz|frequency|real-time)/);
  const mentionsConnectivity = promptText.match(/(offline|cellular|wifi|bluetooth|lora|intermittent)/);

  if (!mentionsFrequency && !mentionsConnectivity && promptText.length < 100) {
    return {
      status: 'uncertainty',
      reason: 'IoT architectures are entirely dictated by payload frequency and connectivity constraints. Recommending a stack without knowing these variables is malpractice.',
      questions: [
        'What is the telemetry payload frequency per device? (1 ping/second vs 1 ping/hour completely changes the database)',
        'How do devices connect? (Stable WiFi vs intermittent Cellular/LoRaWAN)',
        'Do you require bi-directional control (sending commands to devices), or just one-way telemetry ingestion?',
        'How are you handling device provisioning and certificate rotation?'
      ]
    };
  }

  const stack: StackComponent[] = [
    { name: 'MQTT Broker (Mosquitto / AWS IoT Core)', category: 'backend' },
    { name: 'Time-Series Database (TimescaleDB / InfluxDB)', category: 'database' },
    { name: 'Go / Rust (Ingestion Service)', category: 'backend' },
    { name: 'Next.js (Admin Dashboard)', category: 'frontend' }
  ];

  const businessRisks: BusinessRisk[] = [
    {
      risk: 'Data Storage Tsunami',
      level: 'Critical',
      likelihood: 'High',
      reason: 'Thousands of devices pinging telemetry every second will explode your database storage costs if you do not aggressively downsample and partition data.'
    },
    {
      risk: 'Firmware Rollback Failures (Bricking)',
      level: 'Critical',
      likelihood: 'Medium',
      reason: 'If an Over-The-Air (OTA) update contains a bug that drops network connectivity, you permanently brick the entire fleet. You must build A/B partition fallbacks.'
    },
    {
      risk: 'Device Provisioning & Certificate Rotation',
      level: 'High',
      likelihood: 'High',
      reason: 'If devices share a single hardcoded credential, a single breach compromises the entire fleet. Certificates must be uniquely provisioned and rotatable.'
    },
    {
      risk: 'Hardware Supply Chain Lock-in',
      level: 'High',
      likelihood: 'Medium',
      reason: 'If you tightly couple your device agent to a specific silicon vendor, the next chip shortage will halt your business.'
    }
  ];

  const domainConstraints: string[] = [
    'Handling intermittent connectivity and offline buffering on the edge',
    'Asynchronous command & control (C2) messaging to sleeping devices',
    'Over-The-Air (OTA) firmware update orchestration with rollback',
    'Strict payload size optimization to save bandwidth/battery (e.g., Protobuf over JSON)',
    'Battery life optimization (wake-sleep cycles dictate network protocols)'
  ];

  const coreValidationQuestions: string[] = [
    'What is the payload frequency per device? (1 second vs 1 hour completely changes the DB)',
    'How do devices authenticate with the cloud? (mTLS, JWT, pre-shared keys?)',
    'Do devices have reliable power and networking, or are they battery-powered over cellular?'
  ];

  const criticalUnknowns: string[] = [
    'Will cellular/network costs wipe out the profit margin of the hardware?',
    'What happens to the system if 100,000 devices reconnect simultaneously after a cloud outage (Thundering Herd)?'
  ];

  const strategicAdvantages: string[] = [
    'Hardware moats are extremely deep. Once installed, churn is near zero.',
    'Proprietary physical data sets are impossible for competitors to scrape or duplicate.'
  ];

  const challenges: ArchitectureChallenge[] = [
    {
      name: 'The Thundering Herd Problem',
      riskLevel: 'High',
      description: 'When the cloud goes down and comes back up, every device reconnects at the same millisecond. Your broker and DB must absorb massive spike traffic.'
    },
    {
      name: 'Time-Series Aggregation',
      riskLevel: 'High',
      description: 'Standard relational queries (GROUP BY day) are too slow for millions of rows. You must use continuous aggregates or specialized TSDBs.'
    }
  ];

  const deferredDecisions: DeferredDecision[] = [
    {
      name: 'Machine Learning at the Edge',
      reason: 'Running inference on low-power devices is complex. Stream data to the cloud and run ML there until cloud latency or bandwidth costs force you to the edge.'
    },
    {
      name: 'Custom Hardware Design',
      reason: 'Use off-the-shelf development boards (ESP32, Raspberry Pi) for prototyping until you have proven the software value proposition.'
    }
  ];

  const architectureDebt: ArchitectureDebt[] = [
    {
      debt: 'JSON Payloads instead of Binary',
      reason: 'JSON is easy to debug but wastes massive bandwidth. Acceptable for MVP, but you must move to Protobuf/CBOR at scale.'
    }
  ];

  const missingInformation: string[] = [
    'What is the hardware capability (CPU, RAM) of the edge devices?',
    'What is the exact schema and frequency of the telemetry data?'
  ];

  const assumptions = [
    'Assuming the ingestion pipeline is decoupled from the UI API.',
    'Assuming devices can establish outbound TCP connections (for MQTT/WebSockets).'
  ];

  const assumptionRisk: any = {
    level: 'High',
    reason: 'If devices are installed behind strict corporate firewalls, outbound MQTT might be blocked, forcing a pivot to HTTPS polling.'
  };

  const revisitWhen = [
    'Storage costs exceed budget (Implement strict downsampling/rollup policies).',
    'Bandwidth costs from cellular providers force payload optimization.'
  ];

  const upgradePath = [
    { stage: 'Stage 1', trigger: 'MVP', description: 'Devices -> HTTP API -> Standard Postgres.' },
    { stage: 'Stage 2', trigger: '1,000+ Devices', description: 'Migrate to MQTT Broker -> Go Ingestion Worker -> TimescaleDB.' },
    { stage: 'Stage 3', trigger: '100,000+ Devices', description: 'Introduce Kafka for event buffering before database insertion.' }
  ];

  const blueprint: BlueprintCategory[] = [
    { category: 'Frontend', packages: ['next', 'echarts-for-react', 'date-fns'] },
    { category: 'Backend', packages: ['mqtt', 'protobufjs'] },
    { category: 'Database', packages: ['pg', 'timescaledb'] },
    { category: 'Infrastructure', packages: ['aws-iot-device-sdk'] }
  ];

  const operatingCostDrivers: string[] = [
    'Time-Series Database storage (Disk IOPS and capacity)',
    'MQTT Broker connections (paying per million messages)',
    'Edge device cellular data plans (SIM costs)',
    'Ingestion server compute (handling heavy concurrent connections)'
  ];

  return {
    status: 'success',
    data: {
      businessRisks,
      domainConstraints,
      coreValidationQuestions,
      criticalUnknowns,
      strategicAdvantages,
      architectureStyle: 'Event-Driven IoT Ingestion Pipeline',
      confidenceScores: {
        architecture: 95,
        patternSelection: 98,
        deployment: 85,
        cost: 60
      },
      confidenceBreakdown: {
        strongSignals: ['Hardware/IoT terminology detected', 'Telemetry implied'],
        weakSignals: ['Exact payload frequency and device constraints usually omitted']
      },
      missingInformation,
      assumptions,
      assumptionRisk,
      revisitWhen,
      upgradePath,
      stack,
      deployment: ['AWS IoT Core / Managed Mosquitto', 'Dedicated DB Instances for Timescale', 'Edge Devices'],
      recommended: [
        {
          name: 'TimescaleDB (or specialized TSDB)',
          reasons: [
            'Standard Postgres will fall over under heavy insert load from hardware.',
            'Timescale provides automatic partitioning (hyperblocks) and continuous aggregations out of the box.'
          ]
        },
        {
          name: 'MQTT Protocol',
          reasons: [
            'HTTP is too heavy for battery-powered or low-bandwidth devices.',
            'MQTT has built-in Quality of Service (QoS), Retained Messages, and Last Will/Testament for tracking device offline states.'
          ]
        }
      ],
      deferredDecisions,
      architectureDebt,
      challenges,
      blueprint,
      operatingCostDrivers,
      domainBlindSpots: [
        'Hardware is easy. Supporting 500 firmware versions over five years is hard.'
      ]
    }
  };
}
