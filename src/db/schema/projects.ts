import { pgTable, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";



export const projects = pgTable("projects", {
    project_id: serial("project_id").primaryKey().notNull(),
    title: text("title").notNull(),
    active: boolean("active").notNull(),
    archive: boolean("archive").notNull(),
    unarchive: boolean("unarchive").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    deadline: timestamp("deadline"),
})


export type Project = typeof projects.$inferSelect;