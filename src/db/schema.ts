import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const tasks = pgTable("tasks", {
    title: serial("id").primaryKey(),
    description: text("name").notNull(),
    status: text("status").default("doing"),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
});

export const projects = pgTable("projects", {
    project_id: serial("project_id").notNull(),
    active: text("active").notNull(),
    archive: text("archive").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    deadline: timestamp("deadline"),
})