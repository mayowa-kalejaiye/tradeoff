import { config } from 'dotenv';
import path from 'path';
config({ path: path.resolve(__dirname, '.env.local') });
import { extractArchitectureInput } from './src/ai/extractor';

async function test() {
  const { usage } = await extractArchitectureInput("This is a test prompt");
  console.log("Usage object:", usage);
  process.exit(0);
}

test().catch(console.error);
