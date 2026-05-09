import {db} from '../../db'
import { tasks, type Task } from '../../db/schema/tasks'
import { eq } from 'drizzle-orm'


type UpdateInput = {
    title?: string,
    description?: string,
    status?: 'done' | 'doing' | 'todo',
    created_at?: Date
    updated_at?: string
}

export async function createTask(task: Task) {
    const stm = await db.insert(tasks).values({
        title: task.title,
        description: task.description,
        status: task.status,
        created_at: task.created_at,
    }).returning()
    return stm[0]
}

export async function updateTask(title: string, data: UpdateInput) {
    const stm = await db.update(tasks).set({
        ...data,
        updated_at: new Date()
    }).where(eq(tasks.title, title)).returning()
    return stm[0]
}

export async function deleteTask(title: string) {
    const stm = await db.delete(tasks).where(eq(tasks.title, title)).returning()
    return stm[0]
}

export async function getTaskByTitle(title: string) {
    return db.select().from(tasks).where(eq(tasks.title, title));
}

export async function getAllTasks() {
    return db.select().from(tasks);
}