import { db } from '../db/index.ts'
import { tasks } from '../db/schema/tasks.ts'
import { eq } from 'drizzle-orm'
import { type createTaskData} from "../shared/schemas/tasks.ts";


type UpdateInput = {
    title?: string,
    description?: string,
    status?: 'done' | 'doing' | 'paused',
    created_at?: Date
    updated_at?: string
}
export class TaskRepo{
    async createTask(task: createTaskData) {
        try {
            const result = await db
                .insert(tasks)
                .values({
                    title:       task.title,
                    description: task.description,
                    status:      task.status,
                })
                .returning()

            return result[0]
        } catch (err) {
            console.error('[TaskRepo] Failed query:', err)  // ← log the full error object
            throw err
        }
    }

    async  updateTask(title: string, data: UpdateInput) {
        const stm = await db.update(tasks).set({
            ...data,
            updated_at: new Date()
        }).where(eq(tasks.title, title)).returning()
        return stm[0]
    }

    async  deleteTask(title: string) {
        const stm = await db.delete(tasks).where(eq(tasks.title, title)).returning()
        return stm[0]
    }

    async  getTaskByTitle(title: string) {
        return db.select().from(tasks).where(eq(tasks.title, title));
    }

    async  getAllTasks() {
        return db.select().from(tasks);
    }

}




