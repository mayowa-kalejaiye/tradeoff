CREATE TABLE "architecture_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"extracted_domains" jsonb,
	"architecture_style" varchar(255),
	"top_risks" jsonb,
	"blind_spots" jsonb,
	"generation_time_ms" integer,
	"status" varchar(50),
	"error_message" varchar,
	"prompt_length" integer,
	"input_tokens" integer,
	"output_tokens" integer,
	"total_cost" real,
	"unknown_technologies" jsonb,
	"missing_niches" jsonb,
	"confidence_score" integer,
	"graph_schema_version" varchar(50),
	"knowledge_version" varchar(50),
	"resolver_version" varchar(50),
	"llm_version" varchar(50),
	"prompt_version" varchar(50),
	"activated_nodes" jsonb,
	"suppressed_nodes" jsonb,
	"conflicts" jsonb,
	"insight_patches" jsonb,
	"raw_input" jsonb,
	"raw_output" jsonb,
	"is_misclassified" boolean DEFAULT false,
	"feedback_notes" varchar(2000),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "engine_updates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"description" varchar(500) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
