import {ProjectRepo} from '../repositories/projects.ts'
import type {Project, UpdateProjectData} from '../lib/types.ts'







export class ProjectService{
    private project: ProjectRepo
    constructor(project: ProjectRepo) {
        this.project = project
    }
    async create(data: Project){
        const trimmedName = data.title.trim()
        if (!trimmedName)
            throw new Error("Project name is required");
        const exists = await this.project.searchProject(data.project_id);
        if (exists)
            throw new Error("Project already exists");

        return this.project.create(data)
    }

    async update(project_id: string, data: UpdateProjectData){

        const exists = await this.project.findById(project_id);
        if (!exists) throw new Error("Project not found")
        return this.project.update(project_id, data)
    }

    async delete(project_id: string){
        const project = await this.project.findById(project_id)
        if (!project)
            throw new Error("Project does not exist")
        return this.project.deleteProject(project_id)
    }
    async listActive() {
        return this.project.listActive()
    }
    async listArchived(){
        return this.project.listArchived()
    }
}