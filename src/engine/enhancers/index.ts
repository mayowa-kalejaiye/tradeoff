import { ArchitectureInput, ArchitectureOutput } from '../types';
import { enhanceVideo } from './video';
import { enhanceAI } from './ai';
import { enhanceEnterprise } from './enterprise';

export function runEnhancers(input: ArchitectureInput, baseOutput: ArchitectureOutput): ArchitectureOutput {
  let enhanced = baseOutput;
  enhanced = enhanceVideo(input, enhanced);
  enhanced = enhanceAI(input, enhanced);
  enhanced = enhanceEnterprise(input, enhanced);
  return enhanced;
}
