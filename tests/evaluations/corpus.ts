import { EvaluationScenario } from './types';

export const benchmarkCorpus: EvaluationScenario[] = [
  {
    id: 'biotech-platform-001',
    name: 'Biotech Discovery Platform',
    category: 'standard',
    difficulty: 3,
    prompt: `We're building a BioTech platform that helps pharmaceutical companies and research institutions accelerate drug discovery using AI.
Researchers can upload genomic sequences, protein structures, microscopy images, laboratory notes, and experimental results. The platform uses vector search with Qdrant to semantically search research data, scientific papers, and previous experiments.
Long-running workflows such as sample processing, sequencing pipelines, experiment approvals, quality assurance, and laboratory automation are orchestrated with Temporal to guarantee reliable execution, retries, and workflow recovery.
The platform integrates with laboratory equipment, external sequencing providers, cloud HPC clusters, and electronic laboratory notebooks (ELNs).
The system stores highly sensitive scientific and patient-derived data and must comply with HIPAA, GDPR, and FDA 21 CFR Part 11.
Expected users: 25,000 researchers.
Team: 10 senior engineers.
Runway: 18 months.
Priority: reliability`,
    expected: {
      capabilities: [
        'ai.vector_search',
        'data.workflow_orchestration',
        'compliance.hipaa',
        'compliance.fda'
      ],
      industryContexts: ['biotechnology']
    },
    decisions: {
      required: [
        { arena: 'workflow_orchestration', winner: 'Temporal' }, // Example arenas based on Phase 1/2 mappings
        { arena: 'vector_database', winner: 'Qdrant' }
      ]
    }
  }
];
