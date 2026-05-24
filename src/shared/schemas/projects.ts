import { z } from 'zod'


export const createProjectSchema = z.object({
    title:     z.string().min(1, 'Title is required').max(200, 'Title too long').trim(),
    active:    z.boolean().default(true),
    description: z.string().min(10, 'Description is required').max(200, 'Description too long').trim(),
    archive:   z.boolean().default(false),
    created_at: z.coerce.date().default(new Date()),
    project_id: z.number().int().positive('Invalid ID'),
})

export const updateProjectSchema = z.object({
    title:      z.string().min(1).max(200).trim().optional(),
    description: z.string().min(10, 'Description is required').max(200, 'Description too long').trim().optional(),
    active:     z.boolean().optional(),
    archive:    z.boolean().optional(),
}).refine(
    data => Object.keys(data).length > 1,
    { message: 'At least one field must be provided' }
)

// Infer types from the schemas — no manual interface needed
export type CreateProjectData = z.infer<typeof createProjectSchema>
export type UpdateProjectData = z.infer<typeof updateProjectSchema>
