import {z} from "zod"
import {tags} from "../db/schema/tags.ts"
import {projects} from "../db/schema/projects.ts"
import {tasks} from "../db/schema/tasks.ts"
import {createTagSchema} from "../shared/schemas/tags.ts"
import {createProjectSchema, updateProjectSchema} from "../shared/schemas/projects.ts"
import {createTaskSchema, updateTaskSchema} from "../shared/schemas/tasks.ts"

// Project
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type CreateProjectData = z.infer<typeof createProjectSchema>
export type UpdateProjectData = z.infer<typeof updateProjectSchema>

// Task
export type Task           = typeof tasks.$inferSelect
export type InsertTaskData = typeof tasks.$inferInsert
export type createTaskData = z.infer<typeof createTaskSchema>
export type updateTaskData = z.infer<typeof updateTaskSchema>
export type TaskStatus = 'doing' | 'done' | 'paused'

//Tag
export type createTagData = z.infer<typeof createTagSchema>
export type Tag = typeof tags.$inferSelect;
