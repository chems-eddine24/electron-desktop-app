import { TagRepo } from '../repositories/tags.ts';
import type {TagInsert} from '../db/schema/tags.ts'

export type TagResult = {
    tag_id:         string;
    task_id:    string;
    tag_name:       string;
};

function buildTagRows(taskId: string, names: string[]): TagInsert[] {
    return names
        .map((n) => n.trim())
        .filter(Boolean)
        .map((name) => ({
            tag_id:         crypto.randomUUID(),
            task_id:    taskId,
            tag_name: name
        }));
}

export class TagService{
    private Tag: TagRepo

    constructor(Tag: TagRepo) {
        this.Tag = Tag;
    }

    async create() {
        await this.Tag.createTag()
    }
}