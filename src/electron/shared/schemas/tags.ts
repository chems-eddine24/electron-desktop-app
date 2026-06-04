import {z} from 'zod'



export const createTagSchema = z.object({
    tag_name: z.string(),
})

export type createTagData = z.infer<typeof createTagSchema>

