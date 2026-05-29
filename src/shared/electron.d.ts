import type { Task, Project } from './types'
import type { Result } from './ipc-types'
import type { TaskStatus} from "../lib/types.ts";


declare global {
    interface Window {
        electronApi: {
            tasks: {
                getAllTasks: ()                                                    => Promise<Result<Task[]>>
                createTask: (payload: { title: string; description: string; status?: TaskStatus}, project_id: string) => Promise<Result<Task>>
                updateTask: (payload: { task_id: number; title?: string; description?: string; status?: Status }) => Promise<Result<Task>>
                deleteTask: (task_id: string)                                          => Promise<Result<void>>
            }
            projects: {
                getAllProjects: () => Promise<Result<Project[]>>
                createProject: (payload : {title: string; active: boolean, description: string}) => Promise<Result<Project>>
                updateProject: (project_id: string, payload : {archive?: boolean; title?: string; active?: boolean, description?: string}) => Promise<Result<Project>>
                deleteProject: (project_id: string) => Promise<Result<void>>
                selectProject: (project_id: string) => Promise<Result<Project>>

            }
        }
    }
}

export {}