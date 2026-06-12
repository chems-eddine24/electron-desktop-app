import { TaskRepo } from '../repositories/tasks.ts'
import type { Result } from '../shared/ipc_types.ts'
import type { Task } from '../db/schema/tasks.ts'
import { createTaskSchema, updateTaskSchema } from '../shared/schemas/tasks.ts'
import { z } from 'zod'

export class TaskService {
    private taskRepo: TaskRepo
    constructor(taskRepo: TaskRepo) {
        this.taskRepo = taskRepo
    }

    async getAllTasks(): Promise<Result<Task[]>> {
        try {
            const data = await this.taskRepo.getAllTasks()
            return { ok: true, data }
        } catch (err) {
            return this.fail(err)
        }
    }

    async createTask(payload: unknown, project_id: string): Promise<Result<Task>> {
        try {
            const parsed = createTaskSchema.safeParse(payload)
            if (!parsed.success) {
                return { ok: false, error: parsed.error.message }
            }
            const data = await this.taskRepo.createTask(parsed.data, project_id)
            return { ok: true, data }
        } catch (err) {
            return this.fail(err)
        }
    }

    async updateTask(payload: unknown): Promise<Result<Task>> {
        try {
            const parsed = updateTaskSchema.safeParse(payload)
            if (!parsed.success) {
                return { ok: false, error: parsed.error.message }
            }

            const { task_id, ...updates } = parsed.data
            const exists = await this.taskRepo.getTaskById(task_id)
            if (!exists) {
                return { ok: false, error: `Task ${task_id} not found` }
            }

            const data = await this.taskRepo.updateTaskById(task_id, updates)
            return { ok: true, data: data! }
        } catch (err) {
            return this.fail(err)
        }
    }

    async deleteTask(task_id: string): Promise<Result<void>> {
        try {
            const parsed = z.string().uuid('Invalid task id').safeParse(task_id)
            if (!parsed.success) {
                return { ok: false, error: 'Invalid task id' }
            }

            const exists = await this.taskRepo.getTaskById(parsed.data)
            if (!exists) {
                return { ok: false, error: `Task ${parsed.data} not found` }
            }

            await this.taskRepo.deleteTaskById(parsed.data)
            return { ok: true, data: undefined }
        } catch (err) {
            return this.fail(err)
        }
    }

    private fail(err: unknown): Result<never> {
        const message = err instanceof Error ? err.message : 'Unexpected error'
        console.error('[TaskService]', message)
        return { ok: false, error: message }
    }
}
