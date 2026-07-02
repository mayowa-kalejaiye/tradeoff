import { config } from 'dotenv';
import path from 'path';
config({ path: path.resolve(__dirname, '.env.local') });
import { extractArchitectureInput } from './src/ai/extractor';

async function test() {
  const p1 = "A multivendor marketplace";
  const p2 = "A multivendor marketplace with an aggressive launch schedule.";
  
  const res1 = await extractArchitectureInput(p1);
  console.log("Prompt 1:", JSON.stringify(res1.input, null, 2));

  const res2 = await extractArchitectureInput(p2);
  console.log("Prompt 2:", JSON.stringify(res2.input, null, 2));
  
  process.exit(0);
}

test().catch(console.error);
