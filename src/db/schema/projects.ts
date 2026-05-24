import { pgTable, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";



export const projects = pgTable("projects", {
    project_id: serial("project_id").primaryKey().notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    active: boolean("active").notNull(),
    archive: boolean("archive").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at")
})




export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;