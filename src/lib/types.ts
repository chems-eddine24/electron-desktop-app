import {tags} from "../db/schema/tags.ts"
import {projects} from "../db/schema/projects.ts"
import {tasks} from "../db/schema/tasks.ts"



export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Task           = typeof tasks.$inferSelect
export type InsertTaskData = typeof tasks.$inferInsert
export type Tag = typeof tags.$inferSelect;
