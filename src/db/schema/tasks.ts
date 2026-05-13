import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import {type InferSelectModel, type InferInsertModel} from 'drizzle-orm'
export const tasks = pgTable("tasks", {
    task_id: serial("task_id").primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    status: text("status").default("doing"),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),

});

export type Task           = InferSelectModel<typeof tasks>
export type InsertTaskData = InferInsertModel<typeof tasks>
