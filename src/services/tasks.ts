import { TaskRepo } from '../repositories/tasks.ts'
import type { Result } from '../shared/ipc_types.ts'
import type { Task } from '../lib/types.ts'
import {createTaskSchema} from "../shared/schemas/tasks.ts";
import {z} from 'zod'


export class TaskService {
    private  taskRepo: TaskRepo
    constructor(taskRepo: TaskRepo) {
        this.taskRepo = taskRepo
    }


    async getAll(): Promise<Result<Task[]>> {
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
                return {ok: false, error: parsed.error.message}
            }
            const data = await this.taskRepo.createTask(parsed.data, project_id)
            return {ok: true, data }
        }catch (err) {
            return this.fail(err)
        }
    }

    async updateTask(payload: unknown): Promise<Result<Task>> {
        try {
            const parsed = createTaskSchema.safeParse(payload)
            if (!parsed.success) {
                return { ok: false, error: parsed.error.message }
            }

            const exists = await this.taskRepo.getTaskByTitle(parsed.data.title)
            if (!exists) {
                return { ok: false, error: `Task ${parsed.data.title} not found` }
            }

            const data = await this.taskRepo.updateTask(parsed.data.title, parsed.data)
            return { ok: true, data: data! }
        } catch (err) {
            return this.fail(err)
        }
    }

    async deleteTask(title: string): Promise<Result<void>> {
        try {
            const parsed = z.string().min(1, 'Title is required').max(200, 'Title too long').trim().safeParse(title)
            if (!parsed.success) {
                return { ok: false, error: 'Invalid task title' }
            }

            const exists = await this.taskRepo.getTaskByTitle(parsed.data)
            if (!exists) {
                return { ok: false, error: `Task ${parsed.data} not found` }
            }

            await this.taskRepo.deleteTask(parsed.data)
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
