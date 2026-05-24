ALTER TABLE "projects" ADD COLUMN "description" text NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "unarchive";--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "deadline";