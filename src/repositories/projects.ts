import { eq, ilike } from 'drizzle-orm'
import { projects, type Project } from '../db/schema/projects'
import type { DrizzleDb } from '../db/index'


export class ProjectRepo {
    private db: DrizzleDb

    constructor(db: DrizzleDb) {
        this.db = db
    }

    async create(data: Project): Promise<Project> {
        const result = await this.db
            .insert(projects)
            .values({
                title:      data.title,
                active:     data.active ?? true,
                archive:    data.archive ?? false,
                unarchive:     data.unarchive ?? false,
                deadline:   data.deadline ?? null,
                created_at: new Date(),
            })
            .returning()

        return result[0]
    }

    async findById(project_id: number): Promise<Project | null> {
        const result = await this.db
            .select()
            .from(projects)
            .where(eq(projects.project_id, project_id))
            .limit(1)

        return result[0] ?? null
    }

    async findAll(): Promise<Project[]> {
        return this.db
            .select()
            .from(projects)
    }

    async search(title: string): Promise<Project[]> {
        return this.db
            .select()
            .from(projects)
            .where(ilike(projects.title, `%${title}%`))
    }
}