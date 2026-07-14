import { DecisionGraph, ArchitectureDriver } from '../graph';

export const multiTenancyGraph: DecisionGraph = {
  nodes: new Map([
    [
      'rls_multi_tenancy',
      {
        id: 'rls_multi_tenancy',
        type: 'Implementation',
        name: 'Row-Level Security (Shared Database)',
        description: 'Single database with strict row-level security for tenant isolation',
        systemGroup: 'multi_tenancy',
        engineeringComplexity: 'Medium',
        operationalCost: 'Low',
        winsWhen: ['Standard B2B SaaS', 'Cost efficiency required', 'High tenant count, low data per tenant'],
        losesWhen: ['Strict enterprise compliance (tenant data physically separated)', 'Noisy neighbor problems at database level'],
        antiPatterns: [],
        counterExamples: [],
        migrationPath: [],
        failureModes: [],
        changesWhen: [],
        principles: ['design_for_scale'],
        eligibility: {
          anyOf: ['data.multi_tenancy']
        },
        applicability: {
          prefersCapabilities: ['data.multi_tenancy']
        },
        capability: 'tenant_isolation',
        drivers: {
          [ArchitectureDriver.Cost]: 1.0,
          [ArchitectureDriver.DeveloperVelocity]: 0.8,
          [ArchitectureDriver.Scalability]: 0.7
        },
        score: () => 75
      }
    ],
    [
      'schema_per_tenant',
      {
        id: 'schema_per_tenant',
        type: 'Implementation',
        name: 'Schema-per-tenant',
        description: 'Single database cluster, isolated schema per tenant',
        systemGroup: 'multi_tenancy',
        engineeringComplexity: 'Medium',
        operationalCost: 'Medium',
        winsWhen: ['Moderate enterprise compliance', 'Easy tenant backup/restore required'],
        losesWhen: ['Massive tenant count (>10k schemas degrades DB performance)'],
        antiPatterns: [],
        counterExamples: [],
        migrationPath: [],
        failureModes: [],
        changesWhen: [],
        principles: ['defense_in_depth'],
        eligibility: {
          anyOf: ['data.multi_tenancy']
        },
        applicability: {
          prefersCapabilities: ['data.multi_tenancy']
        },
        capability: 'tenant_isolation',
        drivers: {
          [ArchitectureDriver.Security]: 0.8,
          [ArchitectureDriver.Reliability]: 0.7
        },
        score: () => 65
      }
    ],
    [
      'database_per_tenant',
      {
        id: 'database_per_tenant',
        type: 'Implementation',
        name: 'Database-per-tenant',
        description: 'Physically isolated database instance per tenant',
        systemGroup: 'multi_tenancy',
        engineeringComplexity: 'High',
        operationalCost: 'High',
        winsWhen: ['Strict enterprise data sovereignty', 'HIPAA/FedRAMP requirements', 'Eliminate noisy neighbors'],
        losesWhen: ['Thousands of small tenants (cost explodes)', 'Budget constraints'],
        antiPatterns: [],
        counterExamples: [],
        migrationPath: [],
        failureModes: [],
        changesWhen: [],
        principles: ['data_sovereignty'],
        eligibility: {
          anyOf: ['data.multi_tenancy']
        },
        applicability: {
          prefersCapabilities: ['data.multi_tenancy']
        },
        capability: 'tenant_isolation',
        drivers: {
          [ArchitectureDriver.Security]: 1.0,
          [ArchitectureDriver.Reliability]: 1.0,
          [ArchitectureDriver.Cost]: -1.0
        },
        score: () => 60
      }
    ]
  ] as any),
  edges: []
};
