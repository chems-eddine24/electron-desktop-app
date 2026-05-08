CREATE TABLE "projects" (
	"project_id" serial NOT NULL,
	"active" text NOT NULL,
	"archive" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deadline" timestamp
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"status" text DEFAULT 'doing',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
