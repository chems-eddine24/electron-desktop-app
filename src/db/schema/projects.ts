import { pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";



export const projects = pgTable("projects", {
    project_id: uuid("project_id").primaryKey().$default(() => crypto.randomUUID()),
    title: text("title").notNull(),
    description: text("description").notNull(),
    active: boolean("active").notNull(),
    archive: boolean("archive").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at")
})




