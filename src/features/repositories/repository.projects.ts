import  { projects, type Project } from '../../db/schema/projects.ts'
import { db } from '../../db'
import { eq } from 'drizzle-orm'





export async function createProject(project: Project) {
    const stm = await db.insert(projects).values({
        project_id: project.project_id,
        title: project.title,
        active: project.active,
        archive: project.archive,
        unarchive: project.unarchive,
        created_at: project.created_at,
        deadline: project.deadline,
    }).returning()
    return stm[0]
}

export async function searchProject(title: string) {
    return db.select().from(projects).where(eq(projects.title, title))
}

export async function getProjects(project_id: number): Promise<Project[]> {
    return db.select().from(projects).where(eq(projects.project_id, project_id))
}
