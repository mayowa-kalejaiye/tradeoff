import { pgTable, uuid, timestamp, varchar, integer, jsonb } from "drizzle-orm/pg-core";

export const architectureReviews = pgTable("architecture_reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  extractedDomains: jsonb("extracted_domains").$type<string[]>(),
  architectureStyle: varchar("architecture_style", { length: 255 }),
  topRisks: jsonb("top_risks"),
  blindSpots: jsonb("blind_spots"),
  generationTimeMs: integer("generation_time_ms"),
  status: varchar("status", { length: 50 }), // 'success' | 'error'
  errorMessage: varchar("error_message"), // Removed length constraint to fit long errors
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
