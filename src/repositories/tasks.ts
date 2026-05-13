import {type DrizzleDb} from '../db/index.ts'
import { tasks } from '../db/schema/tasks.ts'
import { eq } from 'drizzle-orm'
import { type createTaskData} from "../shared/schemas/schema.task.ts";


type UpdateInput = {
    title?: string,
    description?: string,
    status?: 'done' | 'doing' | 'paused',
    created_at?: Date
    updated_at?: string
}
export class TaskRepo{
    private db: DrizzleDb
    constructor(db: DrizzleDb) {
        this.db = db;
    }
    async createTask(task: createTaskData) {
        try {
            const result = await this.db
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
        const stm = await this.db.update(tasks).set({
            ...data,
            updated_at: new Date()
        }).where(eq(tasks.title, title)).returning()
        return stm[0]
    }

    async  deleteTask(title: string) {
        const stm = await this.db.delete(tasks).where(eq(tasks.title, title)).returning()
        return stm[0]
    }

    async  getTaskByTitle(title: string) {
        return this.db.select().from(tasks).where(eq(tasks.title, title));
    }

    async  getAllTasks() {
        return this.db.select().from(tasks);
    }

}




