CREATE TABLE "tags" (
	"tag_id" serial PRIMARY KEY NOT NULL,
	"tag_name" text NOT NULL,
	"tag_color" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task_tags" (
	"task_id" serial NOT NULL,
	"tag_id" serial NOT NULL
);
--> statement-breakpoint
ALTER TABLE "projects" ADD PRIMARY KEY ("project_id");--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "title" text NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "task_id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "task_tags" ADD CONSTRAINT "task_tags_task_id_tasks_task_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("task_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_tags" ADD CONSTRAINT "task_tags_tag_id_tags_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("tag_id") ON DELETE cascade ON UPDATE no action;