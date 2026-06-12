import { TaskRepo } from './electron/repositories/tasks.ts'
import { TaskService } from './electron/services/tasks.ts'
import { ProjectRepo } from './electron/repositories/projects.ts'
import { ProjectService } from './electron/services/projects.ts'
import { TagRepo } from './electron/repositories/tags.ts'
import { TagService } from './electron/services/tags.ts'

type Container = {
    taskService: TaskService
    projectService: ProjectService
    tagService: TagService
}

export function buildContainer(): Container {
    // Repos
    const taskRepo = new TaskRepo()
    const projectRepo = new ProjectRepo()
    const tagRepo = new TagRepo()

    // Services
    const taskService = new TaskService(taskRepo)
    const projectService = new ProjectService(projectRepo)
    const tagService = new TagService(tagRepo)

    return { taskService, projectService, tagService }
}