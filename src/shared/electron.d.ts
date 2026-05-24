import type { Task, Project } from './types'
import type { Result } from './ipc-types'

type Status = 'doing' | 'done' | 'paused'

declare global {
    interface Window {
        electronApi: {
            tasks: {
                getAllTasks: ()                                                    => Promise<Result<Task[]>>
                createTask: (payload: { title: string; description: string; status?: Status }) => Promise<Result<Task>>
                updateTask: (payload: { task_id: number; title?: string; description?: string; status?: Status }) => Promise<Result<Task>>
                deleteTask: (id: number)                                          => Promise<Result<void>>
            }
            projects: {
                getAllProjects: () => Promise<Result<Project[]>>
                createProject: (payload : {title: string; active: boolean, description: string}) => Promise<Result<Project>>
                updateProject: (project_id: number, payload : {archive?: boolean; title?: string; active?: boolean, description?: string}) => Promise<Result<Project>>
                deleteProject: (id: number) => Promise<Result<void>>
                selectProject: (id: number) => Promise<Result<Project>>

            }
        }
    }
}

export {}