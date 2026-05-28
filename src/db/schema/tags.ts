import {pgTable, uuid, text} from "drizzle-orm/pg-core";


export const tags = pgTable("tags", {
    tag_id: uuid("tag_id").primaryKey().$default(() => crypto.randomUUID()),
    tag_name: text("tag_name").notNull(),
})


