import { z } from 'zod'

const statusEnum = z.enum(['doing', 'done', 'paused'], {
    error: () => ({ message: 'Status must be doing, done, or paused' })
})

export const createTaskSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long').trim(),
    description: z.string().min(1, 'description is required').max(200, 'Description too long').trim(),
    status: statusEnum.default("doing"),
})

export const updateTaskSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long').trim().optional(),
    description: z.string().min(1, 'description is required').max(200, 'Description too long').trim().optional(),
    status: z.string().default("doing").optional(),
    created_at: z.coerce.date().default(new Date()).optional(),
    updated_at: z.coerce.date().default(new Date()).optional(),
})

export type createTaskData = z.infer<typeof createTaskSchema>;
export type updateTaskData = z.infer<typeof updateTaskSchema>;