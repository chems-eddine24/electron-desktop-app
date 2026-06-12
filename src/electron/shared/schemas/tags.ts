import { z } from 'zod'

const tagColorEnum = z.enum(['slate', 'violet', 'blue', 'emerald', 'amber', 'rose', 'cyan', 'orange'])

export const createTagSchema = z.object({
    tag_name: z.string().min(1, 'Tag name is required').max(40, 'Tag name too long').trim(),
    color: tagColorEnum.default('slate'),
})

export const linkTagSchema = z.object({
    tag_id: z.uuid('Invalid tag id'),
})

export const linkTagByNameSchema = z.object({
    tag_name: z.string().min(1).max(40).trim(),
    color: tagColorEnum.optional(),
})

export type CreateTagData = z.infer<typeof createTagSchema>
export type LinkTagData = z.infer<typeof linkTagSchema>
export type LinkTagByNameData = z.infer<typeof linkTagByNameSchema>
