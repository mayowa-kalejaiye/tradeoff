import { corpus } from './corpus';
import { resolveGraph } from '../../src/engine/knowledge/resolver';
import { marketplaceGraph } from '../../src/engine/knowledge/cards/marketplace';
import { roboticsGraph } from '../../src/engine/knowledge/cards/robotics';
import { computerVisionGraph } from '../../src/engine/knowledge/cards/computer_vision';
import { safetyCriticalGraph } from '../../src/engine/knowledge/cards/safety_critical';
import { fleetManagementGraph } from '../../src/engine/knowledge/cards/fleet_management';
import { physicalSafetyGraph } from '../../src/engine/knowledge/cards/physical_safety';
import { observabilityGraph } from '../../src/engine/knowledge/cards/observability';
import { StartupModel } from '../../src/engine/models/startup';

const graphRegistry = [
  marketplaceGraph,
  roboticsGraph,
  computerVisionGraph,
  safetyCriticalGraph,
  fleetManagementGraph,
  physicalSafetyGraph,
  observabilityGraph
];

async function runRegression() {
  console.log('--- STARTING REASONING REGRESSION HARNESS ---\n');
  let passed = 0;
  let failed = 0;

  for (const tc of corpus) {
    const input: StartupModel = {
      isValidRequest: true,
      projectIdea: tc.input.projectIdea || '',
      intent: 'Test',
      capabilities: tc.input.capabilities || [],
      industryContexts: tc.input.industryContexts || [],
      teamScale: tc.input.teamScale || 'small',
      teamSize: tc.input.teamSize || 5,
      expectedUsers: tc.input.expectedUsers || 1000,
      scale: tc.input.scale || 'growth',
      criticality: tc.input.criticality || 'medium',
      latencyTolerance: tc.input.latencyTolerance || 'medium',
      offlineRequirements: tc.input.offlineRequirements || 'none',
      budget: tc.input.budget || 'series_a',
      priority: tc.input.priority || 'speed',
      complianceLevel: tc.input.complianceLevel || 'unknown',
      technicalExperience: tc.input.technicalExperience || 'developer',
      unknownTechnologies: [],
      missingNiches: [],
      confidenceScore: 100
    };

    const { telemetry } = resolveGraph(graphRegistry, input, {});

    const activeIds = new Set(telemetry.activatedNodes);
    const suppressedIds = new Set(telemetry.suppressedNodes.map(n => n.id));

    let casePassed = true;
    const errors: string[] = [];

    for (const expectedAct of tc.assertions.mustActivate) {
      if (!activeIds.has(expectedAct)) {
        casePassed = false;
        errors.push(`[Evaluation/Arena Failure] Expected to activate ${expectedAct}`);
      }
    }

    for (const expectedSup of tc.assertions.mustSuppress) {
      if (activeIds.has(expectedSup)) {
        casePassed = false;
        errors.push(`[Eligibility Failure] Expected to suppress ${expectedSup}, but it was activated!`);
      }
    }

    if (casePassed) {
      console.log(`✅ [${tc.category}] ${tc.name}`);
      passed++;
    } else {
      console.log(`❌ [${tc.category}] ${tc.name}`);
      errors.forEach(e => console.log(`   ${e}`));
      failed++;
    }
  }

  console.log(`\n--- RESULTS ---`);
  console.log(`Passed: ${passed}/${corpus.length}`);
  console.log(`Failed: ${failed}/${corpus.length}`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runRegression().catch(console.error);
