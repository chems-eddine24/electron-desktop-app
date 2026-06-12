import { TagRepo } from '../repositories/tags.ts'
import type { TagSelect } from '../db/schema/tags.ts'
import type { Result } from '../shared/ipc_types.ts'
import {
    createTagSchema,
    linkTagByNameSchema,
    linkTagSchema,
} from '../shared/schemas/tags.ts'
import { z } from 'zod'

const TAG_COLORS = ['slate', 'violet', 'blue', 'emerald', 'amber', 'rose', 'cyan', 'orange'] as const

function colorFromName(name: string): string {
    let hash = 0
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length]
}

export class TagService {
    private tagRepo: TagRepo

    constructor(tagRepo: TagRepo) {
        this.tagRepo = tagRepo
    }

    async getAllTags(): Promise<Result<TagSelect[]>> {
        try {
            const data = await this.tagRepo.getAllTags()
            return { ok: true, data }
        } catch (err) {
            return this.fail(err)
        }
    }

    async createTag(payload: unknown): Promise<Result<TagSelect>> {
        try {
            const parsed = createTagSchema.safeParse(payload)
            if (!parsed.success) return { ok: false, error: parsed.error.message }

            const existing = await this.tagRepo.getTagByName(parsed.data.tag_name)
            if (existing) return { ok: true, data: existing }

            const data = await this.tagRepo.createTag(parsed.data.tag_name, parsed.data.color)
            return { ok: true, data }
        } catch (err) {
            return this.fail(err)
        }
    }

    async deleteTag(tag_id: string): Promise<Result<void>> {
        try {
            const parsed = z.string().uuid().safeParse(tag_id)
            if (!parsed.success) return { ok: false, error: 'Invalid tag id' }

            const exists = await this.tagRepo.getTagById(parsed.data)
            if (!exists) return { ok: false, error: 'Tag not found' }

            await this.tagRepo.deleteTag(parsed.data)
            return { ok: true, data: undefined }
        } catch (err) {
            return this.fail(err)
        }
    }

    async getProjectTags(project_id: string): Promise<Result<TagSelect[]>> {
        try {
            const parsed = z.string().uuid().safeParse(project_id)
            if (!parsed.success) return { ok: false, error: 'Invalid project id' }
            const data = await this.tagRepo.getProjectTags(parsed.data)
            return { ok: true, data }
        } catch (err) {
            return this.fail(err)
        }
    }

    async addTagToProject(project_id: string, payload: unknown): Promise<Result<TagSelect>> {
        try {
            const projectId = z.string().uuid().safeParse(project_id)
            if (!projectId.success) return { ok: false, error: 'Invalid project id' }

            const byName = linkTagByNameSchema.safeParse(payload)
            if (byName.success) {
                let tag = await this.tagRepo.getTagByName(byName.data.tag_name)
                if (!tag) {
                    tag = await this.tagRepo.createTag(
                        byName.data.tag_name,
                        byName.data.color ?? colorFromName(byName.data.tag_name),
                    )
                }
                await this.tagRepo.addTagToProject(projectId.data, tag.tag_id)
                return { ok: true, data: tag }
            }

            const byId = linkTagSchema.safeParse(payload)
            if (!byId.success) return { ok: false, error: 'Invalid tag payload' }

            const tag = await this.tagRepo.getTagById(byId.data.tag_id)
            if (!tag) return { ok: false, error: 'Tag not found' }

            await this.tagRepo.addTagToProject(projectId.data, tag.tag_id)
            return { ok: true, data: tag }
        } catch (err) {
            return this.fail(err)
        }
    }

    async removeTagFromProject(project_id: string, tag_id: string): Promise<Result<void>> {
        try {
            const pid = z.string().uuid().safeParse(project_id)
            const tid = z.string().uuid().safeParse(tag_id)
            if (!pid.success || !tid.success) return { ok: false, error: 'Invalid id' }

            await this.tagRepo.removeTagFromProject(pid.data, tid.data)
            return { ok: true, data: undefined }
        } catch (err) {
            return this.fail(err)
        }
    }

    async getTaskTags(task_id: string): Promise<Result<TagSelect[]>> {
        try {
            const parsed = z.string().uuid().safeParse(task_id)
            if (!parsed.success) return { ok: false, error: 'Invalid task id' }
            const data = await this.tagRepo.getTaskTags(parsed.data)
            return { ok: true, data }
        } catch (err) {
            return this.fail(err)
        }
    }

    async addTagToTask(task_id: string, payload: unknown): Promise<Result<TagSelect>> {
        try {
            const taskId = z.string().uuid().safeParse(task_id)
            if (!taskId.success) return { ok: false, error: 'Invalid task id' }

            const byName = linkTagByNameSchema.safeParse(payload)
            if (byName.success) {
                let tag = await this.tagRepo.getTagByName(byName.data.tag_name)
                if (!tag) {
                    tag = await this.tagRepo.createTag(
                        byName.data.tag_name,
                        byName.data.color ?? colorFromName(byName.data.tag_name),
                    )
                }
                await this.tagRepo.addTagToTask(taskId.data, tag.tag_id)
                return { ok: true, data: tag }
            }

            const byId = linkTagSchema.safeParse(payload)
            if (!byId.success) return { ok: false, error: 'Invalid tag payload' }

            const tag = await this.tagRepo.getTagById(byId.data.tag_id)
            if (!tag) return { ok: false, error: 'Tag not found' }

            await this.tagRepo.addTagToTask(taskId.data, tag.tag_id)
            return { ok: true, data: tag }
        } catch (err) {
            return this.fail(err)
        }
    }

    async removeTagFromTask(task_id: string, tag_id: string): Promise<Result<void>> {
        try {
            const tid = z.string().uuid().safeParse(task_id)
            const tagId = z.string().uuid().safeParse(tag_id)
            if (!tid.success || !tagId.success) return { ok: false, error: 'Invalid id' }

            await this.tagRepo.removeTagFromTask(tid.data, tagId.data)
            return { ok: true, data: undefined }
        } catch (err) {
            return this.fail(err)
        }
    }

    private fail(err: unknown): Result<never> {
        const message = err instanceof Error ? err.message : 'Unexpected error'
        console.error('[TagService]', message)
        return { ok: false, error: message }
    }
}
