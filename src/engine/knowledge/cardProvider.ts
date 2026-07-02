import { ArchitectureInput } from "../types";
import { KnowledgeCard, KnowledgePack, KnowledgeProvider } from "./types";

export class CardKnowledgeProvider implements KnowledgeProvider {
  constructor(
    private version: string,
    private cards: KnowledgeCard[],
    private condition: (input: ArchitectureInput) => boolean
  ) {}

  getKnowledge(input: ArchitectureInput): KnowledgePack | null {
    if (!this.condition(input)) {
      return null;
    }

    // Filter cards based on appliesWhen rules, or just return all associated with this domain
    const applicableCards = this.cards.filter(card => {
      if (!card.appliesWhen) return true;
      // In a more complex implementation, we evaluate against input constraints
      return true; 
    });

    return {
      version: this.version,
      cards: applicableCards
    };
  }
}
