ALTER TABLE "tasks" RENAME COLUMN "name" TO "description";--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "active" SET DATA TYPE boolean;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "archive" SET DATA TYPE boolean;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "unarchive" boolean NOT NULL;