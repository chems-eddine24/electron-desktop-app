import { db } from '../db/index.ts'
import { tasks } from '../db/schema/tasks.ts'
import { eq } from 'drizzle-orm'
import { type createTaskData } from '../shared/schemas/tasks.ts'

type UpdateInput = {
    title?: string
    description?: string
    status?: 'done' | 'doing' | 'paused'
}

export class TaskRepo {
    async createTask(task: createTaskData, project_id: string) {
        try {
            const result = await db
                .insert(tasks)
                .values({
                    title: task.title,
                    description: task.description,
                    status: task.status,
                    project_id: project_id,
                })
                .returning()

            return result[0]
        } catch (err) {
            console.error('[TaskRepo] Failed query:', err)
            throw err
        }
    }

    async updateTaskById(task_id: string, data: UpdateInput) {
        const stm = await db
            .update(tasks)
            .set({
                ...data,
                updated_at: new Date(),
            })
            .where(eq(tasks.task_id, task_id))
            .returning()
        return stm[0]
    }

    async deleteTaskById(task_id: string) {
        const stm = await db.delete(tasks).where(eq(tasks.task_id, task_id)).returning()
        return stm[0]
    }

    async getTaskById(task_id: string) {
        const [task] = await db.select().from(tasks).where(eq(tasks.task_id, task_id)).limit(1)
        return task ?? null
    }

    async getAllTasks() {
        return db.select().from(tasks)
    }
}
