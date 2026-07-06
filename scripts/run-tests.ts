import fs from 'fs';
import path from 'path';
import { recommendArchitecture } from '../src/engine';
import { ArchitectureInput, IndustryContext, Priority, ComplianceLevel } from '../src/engine/types';

const capabilities: IndustryContext[] = ['saas', 'fintech', 'healthcare', 'social_network', 'realtime_collaboration', 'internal_tool', 'ai_saas'];
const teamSizes = [1, 3, 15, 50];
const expectedUsersArray = [1000, 50000, 1000000];
const priorities: Priority[] = ['speed', 'scale', 'reliability'];
const complianceLevels: ComplianceLevel[] = ['unknown', 'hipaa', 'soc2', 'pci_dss'];

const results: string[] = [];
results.push('# AI Architect - Scenario Test Results\n');
results.push('This file contains an automated matrix of architecture recommendations across various constraints.\n');

let count = 0;

async function runTests() {
for (const archetype of capabilities) {
  results.push(`\n## Domain: ${archetype.toUpperCase()}`);
  results.push('---\n');
  
  for (const teamSize of teamSizes) {
    for (const expectedUsers of expectedUsersArray) {
      for (const priority of priorities) {
        for (const compliance of complianceLevels) {
          
          // Skip nonsensical combinations to keep the matrix focused
          if (archetype === 'internal_tool' && expectedUsers > 50000) continue;
          if (archetype === 'internal_tool' && compliance === 'pci_dss') continue;
          if (archetype === 'healthcare' && compliance !== 'hipaa' && compliance !== 'unknown') continue;
          if (archetype === 'fintech' && compliance === 'hipaa') continue;

          count++;
          
          const input: ArchitectureInput = {
            isValidRequest: true,
            projectIdea: `Testing ${archetype} at ${priority} priority for ${expectedUsers} users.`,
            intent: `Testing ${archetype}`,
            industryContexts: [archetype],
            capabilities: [{ id: archetype, name: archetype, score: 95, source: 'deterministic', evidence: [] }],
            teamScale: 'medium',
            teamSize: 5,
            expectedUsers,
            scale: 'growth',
            criticality: 'medium',
            latencyTolerance: 'medium',
            offlineRequirements: 'none',
            budget: 'seed',
            priority,
            complianceLevel: compliance,
            technicalExperience: 'senior_engineer',
            unknownTechnologies: [],
            missingNiches: [],
            confidenceScore: 100
          };

          const response = await recommendArchitecture(input, input.projectIdea);
          
          results.push(`### Test ${count}: ${archetype} | Team: ${teamSize} | Users: ${expectedUsers.toLocaleString()} | Priority: ${priority} | Compliance: ${compliance}`);
          
          if (!response) {
            results.push(`**Error**: Engine returned null.\n`);
            continue;
          }

          if (response.status === 'uncertainty') {
            results.push(`**Uncertainty**: ${response.reason}`);
            continue;
          }

          if (response.status === 'error') {
            results.push(`**Error**: ${response.message}\n`);
            continue;
          }

          results.push(`- **Recommended Pattern**: ${response.data.architectureStyle}`);
          results.push(`- **Confidence Scores**: Arch: ${response.data.confidenceScores.architecture}%, Pattern: ${response.data.confidenceScores.patternSelection}%, Deploy: ${response.data.confidenceScores.deployment}%, Cost: ${response.data.confidenceScores.cost}%`);
          if (response.data.deferredDecisions.length > 0) {
            results.push(`- **Deferred Decisions**:`);
            response.data.deferredDecisions.forEach((d: any) => results.push(`  - ❌ ${d.name} (*${d.reason}*)`));
          }
          if (response.data.architectureDebt.length > 0) {
            results.push(`- **Architecture Debt**:`);
            response.data.architectureDebt.forEach((d: any) => results.push(`  - ✓ ${d.debt} (*${d.reason}*)`));
          }
          if (response.data.assumptionRisk) {
            results.push(`- **Assumption Risk**: ${response.data.assumptionRisk.level} (*${response.data.assumptionRisk.reason}*)`);
          }
          
          results.push('\n');
        }
      }
    }
  }
}
}

runTests().then(() => {
  // Write to the artifacts directory so the user can easily view it
  const artifactDir = 'C:\\Users\\kalej\\.gemini\\antigravity\\brain\\fc30c0e8-041b-4384-9984-cf5a68db9a7d';
  const outputPath = path.join(artifactDir, 'test_results.md');

  fs.writeFileSync(outputPath, results.join('\n'), 'utf8');

  console.log(`Generated ${count} scenarios and saved to test_results.md`);
});
