import {z} from 'zod'



export const createTagSchema = z.object({
    tag_name: z.string(),
})

