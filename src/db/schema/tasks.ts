import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";


export const tasks = pgTable("tasks", {
    task_id: serial("task_id").primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    status: text("status").default("doing"),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at"),

});
