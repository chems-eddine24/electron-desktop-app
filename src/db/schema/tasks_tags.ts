import {pgTable, serial} from "drizzle-orm/pg-core";
import {tags} from "./tags.ts";
import {tasks} from "./tasks.ts";


export const task_tags = pgTable("task_tags", {
    task_id: serial("task_id").notNull().references(() => tasks.task_id, {onDelete: "cascade"}),
    tag_id: serial("tag_id").notNull().references(() => tags.tag_id, {onDelete: "cascade"})
})

