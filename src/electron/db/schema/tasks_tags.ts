import {pgTable, uuid} from "drizzle-orm/pg-core";
import {tags} from "./tags.ts";
import {tasks} from "./tasks.ts";


export const task_tags = pgTable("task_tags", {
    task_id: uuid("task_id").notNull().references(() => tasks.task_id, {onDelete: "cascade"}),
    tag_id: uuid("tag_id").notNull().references(() => tags.tag_id, {onDelete: "cascade"})
})

