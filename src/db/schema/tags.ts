import {pgTable, serial, text} from "drizzle-orm/pg-core";


export const tags = pgTable("tags", {
    tag_id: serial("tag_id").primaryKey(),
    tag_name: text("tag_name").notNull(),
})


export type Tag = typeof tags.$inferSelect;