import { ArchitectureInput, EngineResponse } from '../types';

export function handleBiotech(input: ArchitectureInput): EngineResponse | null {
  const isBiotech = (input.capabilities || []).some(a => a.name === 'biotechnology');
  if (!isBiotech) return null;

  return {
    status: 'success',
    inputCapabilities: (input.capabilities || []).map(c => ({...c, source: 'llm' as const})),
    data: {
      architectureStyle: 'Scientific Workflow Platform',
      confidenceScores: {
        architecture: 95,
        patternSelection: 95,
        deployment: 90,
        cost: 85
      },
      confidenceBreakdown: {
        strongSignals: ['Domain (Biotechnology)', 'Data Type (Genomics, Microscopy)', 'Compliance (FDA 21 CFR Part 11)'],
        weakSignals: ['Throughput of parallel HPC workflows']
      },
      missingInformation: [],
      assumptions: [
        'Assumes data must be retained immutably and versioned for regulatory review.'
      ],
      assumptionRisk: {
        level: 'Low',
        reason: 'Assuming strict immutability and compliance upfront is the only safe path for FDA-regulated tools.'
      },
      revisitWhen: [
        'The volume of sequencing pipelines exceeds local Kubernetes limits and requires pushing workloads to external HPC centers.'
      ],
      upgradePath: [
        { stage: 'Phase 2', trigger: 'High throughput sequencing pipelines', description: 'Introduce specialized HPC clusters or SLURM integration for massive parallel bioinformatics processing.' }
      ],
      stack: [
        { name: 'Temporal or AWS Step Functions', category: 'queue' },
        { name: 'PostgreSQL', category: 'database' },
        { name: 'Qdrant or Milvus', category: 'database' },
        { name: 'S3 / Object Storage', category: 'database' },
        { name: 'Kubernetes', category: 'backend' }
      ],
      deployment: ['AWS (HIPAA Eligible) or GCP (HIPAA BAA)'],
      recommended: [
        {
          name: 'Temporal.io for Workflow Orchestration',
          reasons: [
            'Biotechnology and life sciences platforms deal with highly sensitive data (PHI/Genomics), require strict auditability (FDA 21 CFR Part 11), and depend on long-running, fault-tolerant scientific workflows. Event-driven architectures with robust workflow orchestration are mandatory.'
          ]
        }
      ],
      deferredDecisions: [
        {
          name: 'Custom LIMS',
          reason: 'Do not build a custom Laboratory Information Management System from scratch on day one; integrate with existing ELNs/LIMS.'
        }
      ],
      architectureDebt: [
        {
          debt: 'High upfront operational complexity',
          reason: 'Accepted intentionally. Running stateful workflow orchestrators like Temporal and maintaining compliance adds significant devops overhead, but guarantees scientific reproducibility.'
        }
      ],
      challenges: [
        {
          name: 'FDA 21 CFR Part 11 Electronic Signatures',
          riskLevel: 'High',
          description: 'Every action must have a tamper-proof audit trail linking back to the exact identity of the researcher, with two-factor authentication on specific approval steps.'
        }
      ],
      businessRisks: [
        {
          risk: 'Scientific Reproducibility Failure',
          level: 'Critical',
          likelihood: 'High',
          reason: 'If data lineage and workflow execution history are not perfectly immutable and auditable, research results cannot be trusted or verified.'
        },
        {
          risk: 'Regulatory Approval Failure',
          level: 'Critical',
          likelihood: 'Low',
          reason: 'Patient privacy violations or improper electronic signatures will fail FDA/HIPAA audits, resulting in massive fines and project shutdown.'
        }
      ],
      domainConstraints: [
        'FDA 21 CFR Part 11 Compliance (Electronic Records/Signatures)',
        'HIPAA / GDPR Compliance for sensitive patient-derived data',
        'Immutable audit trails and data lineage tracking',
        'Long-running, stateful workflow orchestration (samples, pipelines, sequences)'
      ],
      coreValidationQuestions: [
        'How will you link sequencing pipeline artifacts in S3 back to the original patient metadata without violating HIPAA?'
      ],
      criticalUnknowns: [
        'Are researchers expecting to run arbitrary R/Python notebooks on the platform, or just predefined pipelines?'
      ],
      strategicAdvantages: [
        'Workflow fault-tolerance: Temporal ensures that a 48-hour sequencing pipeline never drops its state, even if workers crash.'
      ],
      blueprint: [
        { category: 'Infrastructure', packages: ['temporal', 'kubernetes'] },
        { category: 'Database', packages: ['postgresql', 'qdrant'] }
      ],
      operatingCostDrivers: [
        'Workflow orchestrator (Temporal Cloud or self-hosted maintenance)',
        'Vector database hosting (Qdrant Cloud)',
        'Extensive Object Storage (S3) for multi-terabyte genomic datasets'
      ]
    }
  };
}
