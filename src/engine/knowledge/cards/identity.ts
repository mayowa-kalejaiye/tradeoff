import { DecisionGraph, ArchitectureDriver } from '../graph';

export const identityGraph: DecisionGraph = {
  nodes: new Map([
    [
      'auth0',
      {
        id: 'auth0',
        type: 'Implementation',
        name: 'Auth0',
        description: 'Enterprise-grade SaaS Identity and Access Management',
        systemGroup: 'identity',
        engineeringComplexity: 'Medium',
        operationalCost: 'High',
        winsWhen: ['Enterprise SSO (SAML/OIDC) required', 'B2B multi-tenant SaaS'],
        losesWhen: ['Budget constraints', 'Simple B2C login'],
        antiPatterns: [],
        counterExamples: [],
        migrationPath: [],
        failureModes: [],
        changesWhen: [],
        principles: ['buy_dont_build_security'],
        eligibility: {
          anyOf: ['security.identity']
        },
        applicability: {
          prefersCapabilities: ['security.identity']
        },
        capability: 'identity_management',
        drivers: {
          [ArchitectureDriver.Security]: 1.0,
          [ArchitectureDriver.DeveloperVelocity]: 0.8,
          [ArchitectureDriver.Cost]: -0.5
        },
        score: () => 65
      }
    ],
    [
      'clerk',
      {
        id: 'clerk',
        type: 'Implementation',
        name: 'Clerk',
        description: 'Developer-first identity for modern web (React/Next.js)',
        systemGroup: 'identity',
        engineeringComplexity: 'Low',
        operationalCost: 'Medium',
        winsWhen: ['Next.js/React frontend', 'Fast iteration', 'B2C user management'],
        losesWhen: ['Legacy enterprise systems', 'Strict data residency rules'],
        antiPatterns: [],
        counterExamples: [],
        migrationPath: [],
        failureModes: [],
        changesWhen: [],
        principles: ['developer_experience_first'],
        eligibility: {
          anyOf: ['security.identity']
        },
        applicability: {
          prefersCapabilities: ['security.identity']
        },
        capability: 'identity_management',
        drivers: {
          [ArchitectureDriver.DeveloperVelocity]: 1.0,
          [ArchitectureDriver.Security]: 0.8
        },
        score: () => 70
      }
    ],
    [
      'keycloak',
      {
        id: 'keycloak',
        type: 'Implementation',
        name: 'Keycloak',
        description: 'Open-source Identity and Access Management',
        systemGroup: 'identity',
        engineeringComplexity: 'High',
        operationalCost: 'Low',
        winsWhen: ['Strict data sovereignty', 'Self-hosted requirements', 'Air-gapped environments'],
        losesWhen: ['Small teams', 'Fast time-to-market required'],
        antiPatterns: [],
        counterExamples: [],
        migrationPath: [],
        failureModes: [],
        changesWhen: [],
        principles: ['data_sovereignty'],
        eligibility: {
          anyOf: ['security.identity']
        },
        applicability: {
          prefersCapabilities: ['security.identity']
        },
        capability: 'identity_management',
        drivers: {
          [ArchitectureDriver.Security]: 1.0,
          [ArchitectureDriver.Cost]: 0.8,
          [ArchitectureDriver.DeveloperVelocity]: -0.5
        },
        score: () => 60
      }
    ],
    [
      'aws_cognito',
      {
        id: 'aws_cognito',
        type: 'Implementation',
        name: 'AWS Cognito',
        description: 'Amazon\'s native identity service',
        systemGroup: 'identity',
        engineeringComplexity: 'Medium',
        operationalCost: 'Low',
        winsWhen: ['Deep AWS ecosystem integration', 'API Gateway auth'],
        losesWhen: ['Multi-cloud architecture', 'Need highly customizable UI'],
        antiPatterns: [],
        counterExamples: [],
        migrationPath: [],
        failureModes: [],
        changesWhen: [],
        principles: ['cloud_native_integration'],
        eligibility: {
          anyOf: ['security.identity']
        },
        applicability: {
          prefersCapabilities: ['security.identity']
        },
        capability: 'identity_management',
        drivers: {
          [ArchitectureDriver.Security]: 0.8,
          [ArchitectureDriver.Cost]: 0.8
        },
        score: () => 65
      }
    ],
    [
      'supabase_auth',
      {
        id: 'supabase_auth',
        type: 'Implementation',
        name: 'Supabase Auth',
        description: 'Postgres-integrated authentication',
        systemGroup: 'identity',
        engineeringComplexity: 'Low',
        operationalCost: 'Low',
        winsWhen: ['Using Supabase for DB', 'Row-level security integration'],
        losesWhen: ['Enterprise SSO with complex SAML mappings'],
        antiPatterns: [],
        counterExamples: [],
        migrationPath: [],
        failureModes: [],
        changesWhen: [],
        principles: ['developer_experience_first'],
        eligibility: {
          anyOf: ['security.identity']
        },
        applicability: {
          prefersCapabilities: ['security.identity']
        },
        capability: 'identity_management',
        drivers: {
          [ArchitectureDriver.DeveloperVelocity]: 0.9,
          [ArchitectureDriver.Cost]: 0.9
        },
        score: () => 68
      }
    ],
    [
      'firebase_auth',
      {
        id: 'firebase_auth',
        type: 'Implementation',
        name: 'Firebase Auth',
        description: 'Google\'s BaaS authentication',
        systemGroup: 'identity',
        engineeringComplexity: 'Low',
        operationalCost: 'Low',
        winsWhen: ['Mobile-first apps', 'Using Firebase Firestore'],
        losesWhen: ['Relational data integration', 'Vendor lock-in avoidance'],
        antiPatterns: [],
        counterExamples: [],
        migrationPath: [],
        failureModes: [],
        changesWhen: [],
        principles: ['developer_experience_first'],
        eligibility: {
          anyOf: ['security.identity']
        },
        applicability: {
          prefersCapabilities: ['security.identity']
        },
        capability: 'identity_management',
        drivers: {
          [ArchitectureDriver.DeveloperVelocity]: 0.9,
          [ArchitectureDriver.Cost]: 0.8
        },
        score: () => 65
      }
    ]
  ] as any),
  edges: []
};
