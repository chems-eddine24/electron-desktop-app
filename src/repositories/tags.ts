import {eq, and} from "drizzle-orm"
import {tags} from "../db/schema/tags.ts"
import {db} from "../db/index.ts"
import type {createTagData} from "../shared/schemas/tags.ts";
import {projects_tags} from "../db/schema/projects_tags.ts";
import type {Tag} from "../lib/types.ts"
import {task_tags} from "../db/schema/tasks_tags.ts";


export class TagRepo{
    async createTag(tag: createTagData): Promise<void> {
        await db.insert(tags).values({
            tag_color: tag.tag_color,
            tag_name: tag.tag_name,
        }).returning()
    }

    async getAllTags(){
        await db.select().from(tags)
    }

    async deleteTag(tag_id: number): Promise<void> {
        await db.delete(tags).where(eq(tags.tag_id, tag_id)).returning()
    }

    async getTagById(tag_id: number): Promise<Tag | undefined> {
        const [tag] = await db.select().from(tags).where(eq(tags.tag_id, tag_id))
        return tag
    }

    async getTagByName(tag_name: string): Promise<Tag | undefined> {
        const [tag] = await db.select().from(tags).where(eq(tags.tag_name, tag_name))
        return tag
    }

    // Projects
    async addTagToProject(project_id: number, tag_id: number): Promise<void> {
        await db.insert(projects_tags).values({
            project_id: project_id,
            tag_id: tag_id
        }).onConflictDoNothing()
    }
    async deleteFromProject(project_id: number, tag_id: number): Promise<void> {
        await db.delete(projects_tags).where(
            and(
                eq(projects_tags.project_id, project_id),
                eq(projects_tags.tag_id, tag_id)
            )
        ).returning()
    }

    async getProjectTags(project_id: number): Promise<Tag[]> {
        const rows = await db.select({tag: tags}).from(projects_tags).innerJoin(tags, eq(projects_tags.tag_id, tags.tag_id)).
        where(eq(projects_tags.project_id, project_id)).orderBy(tags.tag_name)
        return rows.map((r) => r.tag)
    }

    async deleteAllProjectsTags(project_id: number): Promise<void> {
        await db.delete(projects_tags).where(eq(projects_tags.project_id, project_id))
    }


    // Tasks

    async addTagsToTask(task_id: number, tag_id: number): Promise<void> {
        await db.insert(task_tags).values({task_id: task_id, tag_id: tag_id}).onConflictDoNothing()
    }

    async deleteFromTask(task_id: number, tag_id: number): Promise<void> {
        await db.delete(task_tags).where(
            and(
            eq(task_tags.task_id, task_id),
            eq(task_tags.tag_id, tag_id))).returning()
    }

    async getTaskTags(task_id: number): Promise<Tag[]>{
        const rows = await db.select({tag: tags}).from(task_tags).
            innerJoin(tags, eq(task_tags.tag_id, tags.tag_id)).where(eq(task_tags.task_id, task_id)).orderBy(tags.tag_name)
        return rows.map((r) => r.tag)
    }

    async deleteAllTaksTags(task_id: number): Promise<void> {
        await db.delete(task_tags).where(eq(task_tags.task_id, task_id))
    }
}