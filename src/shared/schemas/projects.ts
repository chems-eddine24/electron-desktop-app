import { z } from 'zod'


export const createProjectSchema = z.object({
    title:     z.string().min(1, 'Title is required').max(200, 'Title too long').trim(),
    active:    z.boolean().default(true),
    archive:   z.boolean().default(false),
    unarchive: z.boolean().default(false),
    created_at: z.coerce.date().default(new Date()),
    deadline:  z.coerce.date().nullable().optional(),
})

export const updateProjectSchema = z.object({
    project_id: z.number().int().positive('Invalid ID'),
    title:      z.string().min(1).max(200).trim().optional(),
    active:     z.boolean().optional(),
    archive:    z.boolean().optional(),
    unarchive:  z.boolean().optional(),
    deadline:   z.coerce.date().nullable().optional(),
}).refine(
    data => Object.keys(data).length > 1,
    { message: 'At least one field must be provided' }
)

// Infer types from the schemas — no manual interface needed
export type CreateProjectData = z.infer<typeof createProjectSchema>
export type UpdateProjectData = z.infer<typeof updateProjectSchema>
