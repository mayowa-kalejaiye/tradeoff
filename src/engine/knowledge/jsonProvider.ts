import { ArchitectureInput, EngineResponse } from "../types";
import { KnowledgePack, KnowledgeProvider } from "./types";

export class JsonKnowledgeProvider implements KnowledgeProvider {
  constructor(
    private version: string,
    private domainHandler: (input: ArchitectureInput) => EngineResponse | null
  ) {}

  getKnowledge(input: ArchitectureInput): KnowledgePack | null {
    const response = this.domainHandler(input);
    
    if (!response || response.status !== 'success') {
      return null;
    }

    // In the future, we could dynamically map the legacy stack to temporary KnowledgeCards here.
    // For now, we just return the legacyOutput and rely on the patcher to handle the legacy shape.
    return {
      version: this.version,
      cards: [], 
      legacyOutput: response.data
    };
  }
}
