import { pgTable, uuid, text } from 'drizzle-orm/pg-core'

export const tags = pgTable('tags', {
    tag_id: uuid('tag_id')
        .primaryKey()
        .$default(() => crypto.randomUUID()),
    tag_name: text('tag_name').notNull().unique(),
    tag_color: text('tag_color').notNull().default('slate'),
})

export type TagInsert = typeof tags.$inferInsert
export type TagSelect = typeof tags.$inferSelect
