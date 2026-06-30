import { config } from 'dotenv';
import path from 'path';
config({ path: path.resolve(__dirname, '../.env.local') });
import fs from 'fs';
import { extractArchitectureInput } from '../src/ai/extractor';
import { recommendArchitecture } from '../src/engine/index';

interface TestCase {
  id: string;
  prompt: string;
  expectedKeywords: string[];
  minimumConfidence: number;
}

async function runTests() {
  console.log('Starting Automated Engine Regression Testing...\n');
  
  const casesPath = path.join(__dirname, '../tests/regression-cases.json');
  const cases: TestCase[] = JSON.parse(fs.readFileSync(casesPath, 'utf8'));
  
  let passed = 0;
  let failed = 0;
  
  const reportLines: string[] = ['# AI Engine Regression Test Report\n'];
  reportLines.push(`*Run Date: ${new Date().toLocaleString()}*\n`);
  reportLines.push('## Test Results\n');
  
  for (const testCase of cases) {
    console.log(`Running test: [${testCase.id}]...`);
    try {
      const { input } = await extractArchitectureInput(testCase.prompt);
      
      const engineResult = recommendArchitecture(input);
      let architectureOutputText = '';
      if (engineResult.status === 'success') {
        const out = engineResult.data;
        architectureOutputText = [
          out.architectureStyle,
          ...(out.stack?.map(s => s.name) || []),
          ...(out.recommended?.map(r => r.name) || []),
          ...(out.domainConstraints || []),
          ...(out.businessRisks?.map(b => b.reason) || [])
        ].join(' ');
      }

      const allTextOutput = [
        input.projectIdea,
        input.complianceLevel,
        ...(input.archetypes?.map(a => a.name) || []),
        ...(input.unknownTechnologies || []),
        ...(input.missingNiches || []),
        architectureOutputText
      ].join(' ').toLowerCase();
      
      const missingKeywords = testCase.expectedKeywords.filter(
        kw => !allTextOutput.includes(kw.toLowerCase())
      );
      
      const confidence = input.confidenceScore || 0;
      const confidencePassed = confidence >= testCase.minimumConfidence;
      
      const isSuccess = missingKeywords.length === 0 && confidencePassed;
      
      if (isSuccess) {
        passed++;
        console.log(`✅ [${testCase.id}] Passed`);
        reportLines.push(`### ✅ ${testCase.id}`);
      } else {
        failed++;
        console.log(`❌ [${testCase.id}] Failed`);
        reportLines.push(`### ❌ ${testCase.id}`);
      }
      
      reportLines.push('');
      reportLines.push(`**Confidence Score:** ${confidence}% (Minimum expected: ${testCase.minimumConfidence}%)`);
      if (missingKeywords.length > 0) {
        reportLines.push(`**Missing Expected Keywords:** ${missingKeywords.join(', ')}`);
      }
      
      reportLines.push('');
      reportLines.push('<details><summary>Extracted Output (JSON)</summary>');
      reportLines.push('');
      reportLines.push('```json');
      reportLines.push(JSON.stringify(input, null, 2));
      reportLines.push('```');
      reportLines.push('</details>\n');
      
    } catch (err: any) {
      failed++;
      console.log(`❌ [${testCase.id}] Error: ${err.message}`);
      reportLines.push(`### ❌ ${testCase.id}`);
      reportLines.push(`**Error:** ${err.message}\n`);
    }
  }
  
  reportLines.unshift(`**Summary:** ${passed} passed, ${failed} failed.\n`);
  
  const reportPath = path.join(__dirname, '../regression-report.md');
  fs.writeFileSync(reportPath, reportLines.join('\n'));
  
  console.log(`\nTests completed: ${passed} passed, ${failed} failed.`);
  console.log(`Detailed report generated at: regression-report.md`);
  
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error("Test runner failed critically:", err);
  process.exit(1);
});
