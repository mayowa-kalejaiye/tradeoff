import { ingestFeedback } from '../src/ai/feedback';
import { ArchitectureOutput } from '../src/engine/types';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function main() {
  const args = process.argv.slice(2);
  const feedbackText = args[0] || "Vercel is too expensive for high concurrency edge functions, we should have used Fly.io or AWS Lambda directly.";

  console.log(`\nAnalyzing Principal Engineer Feedback: "${feedbackText}"\n`);

  // Mock rejected architecture context
  const mockRejectedArchitecture: ArchitectureOutput = {
    businessRisks: [],
    coreValidationQuestions: [],
    criticalUnknowns: [],
    strategicAdvantages: [],
    domainConstraints: ["Must handle 10,000 concurrent websocket connections"],
    architectureStyle: "Serverless Edge",
    confidenceScores: { architecture: 80, patternSelection: 80, deployment: 80, cost: 80 },
    confidenceBreakdown: { strongSignals: [], weakSignals: [] },
    missingInformation: [],
    assumptions: [],
    assumptionRisk: { level: 'Medium', reason: '' },
    revisitWhen: [],
    upgradePath: [],
    stack: [
      { name: "Vercel Edge Functions", category: "backend" },
      { name: "PostgreSQL", category: "database" }
    ],
    deployment: [],
    recommended: [],
    deferredDecisions: [],
    architectureDebt: [],
    challenges: [],
    blueprint: [],
    operatingCostDrivers: []
  };

  try {
    const { updates } = await ingestFeedback(feedbackText, mockRejectedArchitecture);
    
    console.log("==================================================");
    console.log("🧠 CONTINUOUS LEARNING: KNOWLEDGE GRAPH PATCHES");
    console.log("==================================================\n");
    
    if (updates.updates.length === 0) {
      console.log("No actionable graph updates extracted.");
      return;
    }

    for (const update of updates.updates) {
      console.log(`🎯 Target Node: [${update.targetNodeId}]`);
      console.log(`🛠️  Operation:   ${update.operation}`);
      console.log(`➕ Value:       "${update.value}"`);
      console.log(`💡 Reason:      ${update.reason}\n`);
    }

    console.log("Action: An ontology engineer should manually apply these patches to the TypeScript graph definitions.");

  } catch (error) {
    console.error("Failed to ingest feedback:", error);
  }
}

main();
