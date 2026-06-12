import { z } from 'zod'

const statusEnum = z.enum(['doing', 'done', 'paused'], {
    error: () => ({ message: 'Status must be doing, done, or paused' })
})

export const createTaskSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long').trim(),
    description: z.string().max(2000, 'Description too long').trim().default(''),
    status: statusEnum.default('doing'),
})

export const updateTaskSchema = z.object({
    task_id: z.string().uuid('Invalid task id'),
    title: z.string().min(1, 'Title is required').max(200, 'Title too long').trim().optional(),
    description: z.string().max(2000, 'Description too long').trim().optional(),
    status: statusEnum.optional(),
})

export type createTaskData = z.infer<typeof createTaskSchema>
export type updateTaskData = z.infer<typeof updateTaskSchema>
