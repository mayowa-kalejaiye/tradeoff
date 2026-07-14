import { DecisionGraph, ArchitectureDriver } from '../graph';

export const secretsGraph: DecisionGraph = {
  nodes: new Map([
    [
      'hashicorp_vault',
      {
        id: 'hashicorp_vault',
        type: 'Implementation',
        name: 'HashiCorp Vault',
        description: 'Enterprise secret management and encryption as a service',
        systemGroup: 'secrets',
        engineeringComplexity: 'High',
        operationalCost: 'High',
        winsWhen: ['Dynamic secrets required', 'Enterprise compliance (PCI-DSS)', 'Multi-cloud strategy'],
        losesWhen: ['Small team', 'No dedicated DevOps'],
        antiPatterns: [],
        counterExamples: [],
        migrationPath: [],
        failureModes: [],
        changesWhen: [],
        principles: ['defense_in_depth'],
        eligibility: {
          anyOf: ['security.secrets']
        },
        applicability: {
          prefersCapabilities: ['security.secrets']
        },
        capability: 'secrets_management',
        drivers: {
          [ArchitectureDriver.Security]: 1.0,
          [ArchitectureDriver.Reliability]: 0.8,
          [ArchitectureDriver.DeveloperVelocity]: -0.5
        },
        score: () => 65
      }
    ],
    [
      'aws_secrets_manager',
      {
        id: 'aws_secrets_manager',
        type: 'Implementation',
        name: 'AWS Secrets Manager',
        description: 'Native AWS secret storage and rotation',
        systemGroup: 'secrets',
        engineeringComplexity: 'Medium',
        operationalCost: 'Medium',
        winsWhen: ['AWS-native infrastructure', 'RDS password rotation needed'],
        losesWhen: ['Multi-cloud deployments'],
        antiPatterns: [],
        counterExamples: [],
        migrationPath: [],
        failureModes: [],
        changesWhen: [],
        principles: ['cloud_native_integration'],
        eligibility: {
          anyOf: ['security.secrets']
        },
        applicability: {
          prefersCapabilities: ['security.secrets']
        },
        capability: 'secrets_management',
        drivers: {
          [ArchitectureDriver.Security]: 0.9,
          [ArchitectureDriver.Reliability]: 0.9
        },
        score: () => 70
      }
    ],
    [
      'infisical',
      {
        id: 'infisical',
        type: 'Implementation',
        name: 'Infisical',
        description: 'Open-source, end-to-end encrypted secret syncing',
        systemGroup: 'secrets',
        engineeringComplexity: 'Low',
        operationalCost: 'Low',
        winsWhen: ['Developer secret syncing', 'Startup velocity', 'Self-hosting option'],
        losesWhen: ['Complex dynamic secret generation needed'],
        antiPatterns: [],
        counterExamples: [],
        migrationPath: [],
        failureModes: [],
        changesWhen: [],
        principles: ['developer_experience_first'],
        eligibility: {
          anyOf: ['security.secrets']
        },
        applicability: {
          prefersCapabilities: ['security.secrets']
        },
        capability: 'secrets_management',
        drivers: {
          [ArchitectureDriver.DeveloperVelocity]: 1.0,
          [ArchitectureDriver.Security]: 0.8
        },
        score: () => 75
      }
    ],
    [
      'doppler',
      {
        id: 'doppler',
        type: 'Implementation',
        name: 'Doppler',
        description: 'Multi-environment secret operations platform',
        systemGroup: 'secrets',
        engineeringComplexity: 'Low',
        operationalCost: 'Medium',
        winsWhen: ['Multi-environment secret syncing', 'Developer experience prioritized'],
        losesWhen: ['Strict self-hosting requirements'],
        antiPatterns: [],
        counterExamples: [],
        migrationPath: [],
        failureModes: [],
        changesWhen: [],
        principles: ['developer_experience_first'],
        eligibility: {
          anyOf: ['security.secrets']
        },
        applicability: {
          prefersCapabilities: ['security.secrets']
        },
        capability: 'secrets_management',
        drivers: {
          [ArchitectureDriver.DeveloperVelocity]: 1.0,
          [ArchitectureDriver.Security]: 0.8
        },
        score: () => 72
      }
    ]
  ] as any),
  edges: []
};
