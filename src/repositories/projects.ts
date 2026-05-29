import { eq } from 'drizzle-orm'
import { projects} from '../db/schema/projects.ts'
import  { db } from '../db/index.ts'
import type {CreateProjectData, UpdateProjectData, Project} from "../lib/types.ts"


export class ProjectRepo {
    async create(data: CreateProjectData): Promise<Project> {
        const result = await db
            .insert(projects)
            .values({
                title: data.title,
                active: data.active ?? true,
                archive: data.archive ?? false,
                created_at: new Date(),
                description: data.description ?? '',
            })
            .returning()

        return result[0]
    }

    async update(project_id: string, data: UpdateProjectData) {
        const updatedProject = await db.update(projects).set({...data, updated_at: new Date()}).where(eq(projects.project_id, project_id)).returning()
        return updatedProject[0]
    }

    async findById(project_id: string): Promise<Project | null> {
        const result = await db
            .select()
            .from(projects)
            .where(eq(projects.project_id, project_id))
            .limit(1)

        return result[0] ?? null
    }


    async searchProject(project_id: string) {
        const [project] = await db.select().from(projects).where(eq(projects.project_id, project_id
        ))
        return project ?? null
    }

    async deleteProject(project_id: string) {
        return db.delete(projects).where(eq(projects.project_id, project_id))
    }

    async listActive(){
        return db.select().from(projects).where(eq(projects.active, true))
    }
    async listArchived(){
        return db.select().from(projects).where(eq(projects.archive, true))
    }
}