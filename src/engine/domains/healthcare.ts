import { ArchitectureInput, EngineResponse, BusinessRisk } from '../types';

export function handleHealthcare(input: ArchitectureInput): EngineResponse | null {
  const isHealthcare = input.archetypes.some(a => a.name === 'healthcare') || input.complianceLevel === 'hipaa';
  if (!isHealthcare) return null;

  const promptText = input.projectIdea.toLowerCase();
  
  // Principal Engineer Pushback
  const mentionsPHI = promptText.match(/(phi|patient data|health records)/);
  const mentionsIntegrations = promptText.match(/(epic|cerner|ehr|emr|hl7|fhir)/);
  const mentionsVideo = promptText.match(/(video|telehealth)/);

  if (!mentionsPHI && !mentionsIntegrations && promptText.length < 100) {
    return {
      status: 'uncertainty',
      reason: 'Healthcare architectures are completely dictated by compliance boundaries. Recommending a stack without knowing your data payload and integration points is dangerous.',
      questions: [
        'Are you storing Protected Health Information (PHI) directly, or just anonymized metadata?',
        'Do you need to integrate with legacy EHR systems like Epic or Cerner via HL7/FHIR?',
        'Is real-time video consultation required?',
        'Which countries will you operate in? (HIPAA vs GDPR vs PIPEDA radically changes the cloud region strategy)'
      ]
    };
  }

  // Speed vs Compliance Collision
  if (input.complianceLevel === 'hipaa' && input.priority === 'speed' && input.teamSize <= 3) {
    return {
      status: 'success',
      data: {
        architectureStyle: 'Compliance PaaS (Managed)',
        confidenceScores: {
          architecture: 80,
          patternSelection: 95,
          deployment: 98,
          cost: 70
        },
        confidenceBreakdown: {
          strongSignals: ['Team Size (Small)', 'Delivery Priority (Speed)', 'Strict Compliance (HIPAA)'],
          weakSignals: ['Actual Patient Data Volume', 'Integration requirements with legacy EHR systems (Epic/Cerner)']
        },
        missingInformation: [
          'Integration requirements with legacy EHR systems (Epic/Cerner)',
          'Whether you are storing Protected Health Information (PHI) directly or using tokenization'
        ],
        assumptions: [
          'Assumes you have the budget ($500+/mo) to buy compliance rather than build it.',
          'Assumes you are starting fresh and do not have an existing sprawling AWS footprint.'
        ],
        assumptionRisk: {
          level: 'High',
          reason: 'If funding is extremely tight, the PaaS premiums will kill your runway before launch.'
        },
        revisitWhen: [
          'Monthly platform costs exceed $5000 and it becomes cheaper to run self-managed HIPAA clusters.',
          'Hospital IT departments require BAA agreements that your PaaS provider will not sign.'
        ],
        upgradePath: [
          { stage: 'Stage 1: Dedicated VPC on Aptible/Medplum', trigger: 'When onboarding your first major hospital system.' },
          { stage: 'Stage 2: Hybrid Cloud (On-Prem EHR Sync)', trigger: 'When integrating deeply with legacy on-prem EHR databases.' },
          { stage: 'Stage 3: Self-Managed Kubernetes (EKS)', trigger: 'When DevOps team grows and PaaS costs exceed engineer salaries.' }
        ],
        stack: [
          { name: 'Next.js (App Router)', category: 'frontend' },
          { name: 'Medplum / Supabase (with BAA)', category: 'database' },
          { name: 'Vanta / Drata (Compliance)', category: 'other' }
        ],
        deployment: ['Aptible (HIPAA Compliant PaaS) or Vercel (with Enterprise BAA)'],
        recommended: [
          {
            name: 'Managed Compliance PaaS (Aptible / Medplum)',
            reasons: [
              'Buy compliance, do not build it. Building HIPAA compliant infrastructure from scratch with 2 engineers will guarantee you miss your deadline.',
              'Offloads BAA (Business Associate Agreement) liability and infrastructure auditing to the platform.'
            ]
          }
        ],
        deferredDecisions: [
          {
            name: 'Custom AWS VPC / Self-Managed Kubernetes',
            reason: 'Intentionally deferred. Configuring IAM roles, audit logging, and encryption-at-rest to pass a HIPAA audit will consume 100% of your 2-person team\'s time.'
          },
          {
            name: 'Kafka / Event-Sourcing',
            reason: 'Intentionally deferred. Healthcare requires auditability, but for a 2-month MVP, standard relational database audit tables are sufficient. Kafka is operational overkill right now.'
          }
        ],
        architectureDebt: [
          {
            debt: 'Severe Vendor Pricing Premium',
            reason: 'Accepted intentionally. You are trading money for speed and legal safety. You will overpay for infrastructure until you have the team to build it.'
          }
        ],
        challenges: [
          {
            name: 'Vendor Lock-in',
            riskLevel: 'Medium',
            description: 'You are completely tied to your compliance vendor. If they raise prices, you have zero leverage.'
          }
        ],
        businessRisks: [
          {
            risk: 'HIPAA Violations & BAAs',
            level: 'Critical',
            likelihood: 'Low',
            reason: 'Handling Protected Health Information (PHI) incorrectly carries massive civil and criminal penalties. Any third-party service you use MUST sign a Business Associate Agreement (BAA).'
          }
        ],
        domainConstraints: [
          'Strict BAA (Business Associate Agreement) requirements for all vendors',
          'Audit logging for every record access (who, what, when)',
          'Data encryption in transit and at rest'
        ],
        coreValidationQuestions: [
          'Is our compliance PaaS actually covering our specific architectural use cases?',
          'Do we have BAAs signed with every single sub-processor we transmit PHI to?'
        ],
        criticalUnknowns: [
          'Will hospital IT departments actually allow us to integrate with their Epic/Cerner instances?',
          'Can we absorb the massive per-container PaaS markup once we scale beyond 10k users?'
        ],
        strategicAdvantages: [
          'High development speed: Offloading compliance to a PaaS lets you ship features like a normal startup.',
          'Instant trust: You can show enterprise healthcare clients your Vanta/Aptible compliance badge on day one.'
        ],
        blueprint: [
          { category: 'Frontend', packages: ['next', 'react'] },
          { category: 'Backend', packages: ['express', 'helmet', 'cors', '@medplum/react'] }
        ],
        operatingCostDrivers: [
          'Compliance PaaS licensing (Vanta/Aptible) - scales by employee headcount or container count',
          'Managed database premiums for BAA-signed tiers (RDS, etc.)',
          'Enterprise SSO providers (Okta/Auth0) for staff access'
        ],
        domainBlindSpots: [
          'Compliance is not your moat. Patient outcomes are.'
        ]
      }
    };
  }

  // The Enterprise Economics Flip
  if (input.complianceLevel === 'hipaa' && input.teamSize >= 15 && input.expectedUsers >= 100000) {
    return {
      status: 'success',
      data: {
        architectureStyle: 'Event-Driven Microservices (Self-Managed EKS)',
        confidenceScores: {
          architecture: 95,
          patternSelection: 85,
          deployment: 90,
          cost: 65
        },
        confidenceBreakdown: {
          strongSignals: ['Team Size (Enterprise)', 'Traffic (High Scale)', 'Strict Compliance (HIPAA)'],
          weakSignals: ['Deployment timeline']
        },
        missingInformation: [
          'Whether you process payments directly or use a medical clearinghouse.'
        ],
        assumptions: [
          'Assumes you have dedicated DevSecOps engineers.',
          'Assumes the massive cloud bill of PaaS providers at 100k users justifies a multi-month compliance engineering project.'
        ],
        assumptionRisk: {
          level: 'High',
          reason: 'Recommendation depends heavily on DevSecOps availability. If you cannot hire strong security engineers, do not build this.'
        },
        revisitWhen: [
          'Maintaining internal infrastructure slows product velocity too much compared to competitors.'
        ],
        upgradePath: [],
        stack: [
          { name: 'Go / Java / Node.js', category: 'backend' },
          { name: 'PostgreSQL (Dedicated RDS)', category: 'database' },
          { name: 'Kafka', category: 'queue' },
          { name: 'AWS EKS', category: 'other' }
        ],
        deployment: ['Self-Managed AWS EKS (Strict VPC, VPN, Audit Logging)'],
        recommended: [
          {
            name: 'Self-Managed Kubernetes (EKS)',
            reasons: [
              'The economics have changed. It is now cheaper to build and maintain compliance internally than to pay PaaS premiums at scale.',
              'You have the 15-person team required to dedicate 2-3 engineers strictly to DevSecOps and compliance auditing.'
            ]
          }
        ],
        deferredDecisions: [
          {
            name: 'Managed Compliance PaaS (Aptible / Vanta)',
            reason: 'Intentionally deferred. The pricing model of HIPAA PaaS providers scales poorly past 100k active users.'
          }
        ],
        architectureDebt: [
          {
            debt: 'Massive DevOps Burden',
            reason: 'Accepted intentionally. Maintaining HIPAA compliance on bare cloud infrastructure requires continuous auditing, but preserves your gross margins at scale.'
          }
        ],
        challenges: [
          {
            name: 'Continuous Compliance Auditing',
            riskLevel: 'High',
            description: 'Your team is now legally liable for every misconfigured S3 bucket and IAM role.'
          }
        ],
        businessRisks: [
          {
            risk: 'HIPAA Violations & BAAs',
            level: 'Critical',
            likelihood: 'Medium',
            reason: 'Handling Protected Health Information (PHI) incorrectly carries massive civil and criminal penalties. Any third-party service you use MUST sign a Business Associate Agreement (BAA).'
          }
        ],
        domainConstraints: [
          'Strict BAA (Business Associate Agreement) requirements for all vendors',
          'Audit logging for every record access (who, what, when)',
          'Data encryption in transit and at rest',
          'Enterprise role-based access control (RBAC)'
        ],
        coreValidationQuestions: [
          'Are our self-managed IAM roles and VPC boundaries strictly isolated?',
          'Is our audit logging system durable and tamper-proof?'
        ],
        criticalUnknowns: [
          'Are we legally liable for an obscure S3 misconfiguration?',
          'Do we have the internal talent to pass a rigorous 3rd-party HIPAA compliance audit?'
        ],
        strategicAdvantages: [
          'Massive cost savings at scale compared to paying per-container compliance premiums.',
          'Complete control over your infrastructure allows for specialized medical imaging or AI workloads.'
        ],
        blueprint: [
          { category: 'Infrastructure', packages: ['terraform', 'aws-cdk-lib'] }
        ],
        operatingCostDrivers: [
          'Raw cloud compute (EC2/EKS) without PaaS markup',
          'Extensive S3 storage for medical imaging or backups',
          'High data egress costs for large file transfers',
          'DevSecOps headcount (massive shift from software OPEX to payroll)'
        ],
        domainBlindSpots: [
          'Compliance is not your moat. Patient outcomes are.'
        ]
      }
    };
  }

  // Fallback for general healthcare that passed the pushback but doesn't hit specific enterprise/speed rules
  return {
    status: 'success',
    data: {
      architectureStyle: 'Compliance PaaS (Managed)',
      confidenceScores: { architecture: 70, patternSelection: 80, deployment: 90, cost: 60 },
      confidenceBreakdown: { strongSignals: ['Healthcare domain'], weakSignals: [] },
      missingInformation: [], assumptions: [], assumptionRisk: { level: 'Medium', reason: 'Generic healthcare fallback' },
      revisitWhen: [], upgradePath: [], stack: [
        { name: 'Next.js', category: 'frontend' }, { name: 'PostgreSQL (BAA-signed)', category: 'database' }
      ],
      deployment: ['HIPAA Compliant PaaS (Aptible/Medplum)'], recommended: [], deferredDecisions: [],
      architectureDebt: [], challenges: [], businessRisks: [], domainConstraints: ['Strict BAA required'],
      coreValidationQuestions: [], criticalUnknowns: [], strategicAdvantages: [], blueprint: [], operatingCostDrivers: [],
      domainBlindSpots: [
        'Compliance is not your moat. Patient outcomes are.'
      ]
    }
  };
}
