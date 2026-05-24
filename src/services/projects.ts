import {ProjectRepo} from '../repositories/projects.ts'

import type {CreateProjectData, UpdateProjectData} from '../shared/schemas/projects.ts'







export class ProjectService{
    private project: ProjectRepo
    constructor(project: ProjectRepo) {
        this.project = project
    }
    async create(data: CreateProjectData){
        const trimmedName = data.title.trim()
        if (!trimmedName)
            throw new Error("Project name is required");
        const exists = await this.project.searchProject(data.project_id);
        if (exists)
            throw new Error("Project already exists");

        return this.project.create(data)
    }

    async update(project_id: number, data: UpdateProjectData){

        const exists = await this.project.findById(project_id);
        if (exists && exists.project_id !== project_id)
            throw new Error("Another Project uses this name")
        return this.project.update(project_id, data)
    }

    async delete(project_id: number){
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