import {pgTable, uuid, text} from "drizzle-orm/pg-core";
import {tasks} from "./tasks.ts";


export const tags = pgTable("tags", {
    tag_id: uuid("tag_id").primaryKey().$default(() => crypto.randomUUID()),
    tag_name: text("tag_name").notNull(),
    task_id: uuid("task_id").references(() => tasks.task_id, {onDelete: "cascade"}),
})

export type TagInsert = typeof tags.$inferInsert
export type TagSelect = typeof tags.$inferSelect


