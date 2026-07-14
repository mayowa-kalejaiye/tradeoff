import { config } from 'dotenv';
import path from 'path';
config({ path: path.resolve(__dirname, '../.env.local') });
import fs from 'fs';
import { extractArchitectureInput } from '../src/ai/extractor';
import { recommendArchitecture } from '../src/engine/index';
import { benchmarkCorpus } from '../tests/evaluations/corpus';
import { EvaluationScenario } from '../tests/evaluations/types';

async function runEvaluations() {
  console.log('Starting Evaluation Infrastructure (Phase 0)...\n');
  
  let passed = 0;
  let failed = 0;
  
  const reportLines: string[] = ['# AI Engine Evaluation Report\n'];
  reportLines.push(`*Run Date: ${new Date().toLocaleString()}*\n`);
  reportLines.push('## Test Results\n');
  
  for (const testCase of benchmarkCorpus) {
    console.log(`Evaluating scenario: [${testCase.id}] - ${testCase.name} (Difficulty: ${testCase.difficulty})`);
    try {
      // 1. EXTRACTION PIPELINE
      const { input } = await extractArchitectureInput(testCase.prompt);
      
      const extractedCaps = input.capabilities?.map(c => c.name) || [];
      const missingCaps = testCase.expected.capabilities.filter(c => !extractedCaps.includes(c));
      
      let extractionPassed = missingCaps.length === 0;
      
      // 2. ACTIVATION & DECISION PIPELINE
      const engineResult = await recommendArchitecture(input, testCase.prompt);
      
      let activationPassed = true;
      let decisionPassed = true;
      let missingDecisions: string[] = [];
      let leakedNodes: string[] = [];

      if (engineResult.status === 'success') {
        const out = engineResult.data;
        const selectedNodes = [
          ...(out.stack?.map((s: any) => s.name) || []),
          ...(out.recommended?.map((r: any) => r.name) || [])
        ];

        // Check required decisions
        for (const req of testCase.decisions.required) {
          // Temporarily matching winner string until arenas are fully modeled in Phase 2
          if (!selectedNodes.some(n => n.includes(req.winner))) {
            decisionPassed = false;
            missingDecisions.push(`Missing winner ${req.winner} for arena ${req.arena}`);
          }
        }

        // Check prohibited nodes
        if (testCase.decisions.prohibited) {
          for (const prohibited of testCase.decisions.prohibited) {
            if (selectedNodes.some(n => n === prohibited || n.includes(prohibited))) {
              decisionPassed = false;
              leakedNodes.push(prohibited);
            }
          }
        }
      } else {
        decisionPassed = false;
        missingDecisions.push("Engine failed to generate architecture");
      }

      const isSuccess = extractionPassed && activationPassed && decisionPassed;
      
      if (isSuccess) {
        passed++;
        console.log(`✅ [${testCase.id}] Passed`);
        reportLines.push(`### ✅ ${testCase.id} - ${testCase.name}`);
      } else {
        failed++;
        console.log(`❌ [${testCase.id}] Failed`);
        reportLines.push(`### ❌ ${testCase.id} - ${testCase.name}`);
        if (testCase.failureClass) {
          reportLines.push(`**Historical Failure Class:** \`${testCase.failureClass}\``);
        }
        reportLines.push('');
        
        if (!extractionPassed) {
          reportLines.push(`**Extraction Failures:**`);
          reportLines.push(`- Missing required capabilities: ${missingCaps.join(', ')}`);
        }
        
        if (!decisionPassed) {
          reportLines.push(`**Decision Failures:**`);
          missingDecisions.forEach(m => reportLines.push(`- ${m}`));
          leakedNodes.forEach(l => reportLines.push(`- LEAKED PROHIBITED NODE: ${l}`));
        }
      }
      reportLines.push('\n---\n');
      
    } catch (err: any) {
      failed++;
      console.log(`❌ [${testCase.id}] Error: ${err.message}`);
      reportLines.push(`### ❌ ${testCase.id}`);
      reportLines.push(`**Error:** ${err.message}\n---\n`);
    }
  }
  
  reportLines.unshift(`**Summary:** ${passed} passed, ${failed} failed.\n`);
  
  const reportPath = path.join(__dirname, '../regression-report.md');
  fs.writeFileSync(reportPath, reportLines.join('\n'));
  
  console.log(`\nEvaluations completed: ${passed} passed, ${failed} failed.`);
  console.log(`Detailed report generated at: regression-report.md`);
  
  if (failed > 0) {
    process.exit(1);
  }
}

runEvaluations().catch(err => {
  console.error("Evaluation framework failed critically:", err);
  process.exit(1);
});
