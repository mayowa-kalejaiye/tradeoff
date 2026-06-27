import { pgTable, uuid, timestamp, varchar, integer, jsonb, real } from "drizzle-orm/pg-core";

export const architectureReviews = pgTable("architecture_reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  extractedDomains: jsonb("extracted_domains").$type<string[]>(),
  architectureStyle: varchar("architecture_style", { length: 255 }),
  topRisks: jsonb("top_risks"),
  blindSpots: jsonb("blind_spots"),
  generationTimeMs: integer("generation_time_ms"),
  status: varchar("status", { length: 50 }), // 'started' | 'success' | 'error'
  errorMessage: varchar("error_message"), // Removed length constraint to fit long errors
  
  // Intelligence Metrics
  promptLength: integer("prompt_length"),
  inputTokens: integer("input_tokens"),
  outputTokens: integer("output_tokens"),
  totalCost: real("total_cost"),
  unknownTechnologies: jsonb("unknown_technologies").$type<string[]>(),
  missingNiches: jsonb("missing_niches").$type<string[]>(),
  confidenceScore: integer("confidence_score"),
  
  // Public Sharing & Rehydration
  rawInput: jsonb("raw_input"),
  rawOutput: jsonb("raw_output"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const engineUpdates = pgTable("engine_updates", {
  id: uuid("id").defaultRandom().primaryKey(),
  description: varchar("description", { length: 500 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
