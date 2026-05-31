import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import {projects} from "./projects.ts";


export const tasks = pgTable("tasks", {
    task_id: uuid("task_id").primaryKey().$default(() => crypto.randomUUID()),
    title: text("title").notNull(),
    description: text("description").notNull(),
    status: text("status").default("doing"),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at"),
    project_id: uuid("project_id").references(() => projects.project_id, {onDelete: "cascade"}),
});
export type Task           = typeof tasks.$inferSelect
export type InsertTaskData = typeof tasks.$inferInsert