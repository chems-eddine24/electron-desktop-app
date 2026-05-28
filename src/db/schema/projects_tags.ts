import {pgTable, uuid} from "drizzle-orm/pg-core";
import {tags} from "./tags.ts";
import {projects} from "./projects.ts";


export const projects_tags = pgTable("projects_tag", {
    project_id: uuid().notNull().references(() => projects.project_id, {onDelete: "cascade"}),
    tag_id: uuid().notNull().references(() => tags.tag_id, {onDelete: "cascade"})
})