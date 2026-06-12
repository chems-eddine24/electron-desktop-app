import type { Project, Task, TaskStatus } from '../lib/types.ts'
import type { Result } from './ipc_types.ts'

export type DbTag = {
    tag_id: string
    tag_name: string
    tag_color: string
}

declare global {
    interface Window {
        electronApi: {
            tasks: {
                getAllTasks: () => Promise<Result<Task[]>>
                createTask: (
                    payload: { title: string; description: string; status: TaskStatus },
                    project_id: string,
                ) => Promise<Result<Task>>
                updateTask: (payload: {
                    task_id: string
                    title?: string
                    description?: string
                    status?: TaskStatus
                }) => Promise<Result<Task>>
                deleteTask: (task_id: string) => Promise<Result<void>>
            }
            projects: {
                getAllProjects: () => Promise<Project[]>
                createProject: (payload: {
                    title: string
                    active: boolean
                    description: string
                }) => Promise<Project>
                updateProject: (
                    project_id: string,
                    payload: {
                        archive?: boolean
                        title?: string
                        active?: boolean
                        description?: string
                    },
                ) => Promise<Project>
                deleteProject: (project_id: string) => Promise<void>
            }
            tags: {
                getAllTags: () => Promise<Result<DbTag[]>>
                createTag: (payload: {
                    tag_name: string
                    color?: string
                }) => Promise<Result<DbTag>>
                deleteTag: (tag_id: string) => Promise<Result<void>>
                getProjectTags: (project_id: string) => Promise<Result<DbTag[]>>
                addTagToProject: (
                    project_id: string,
                    payload: { tag_name: string; color?: string },
                ) => Promise<Result<DbTag>>
                removeTagFromProject: (
                    project_id: string,
                    tag_id: string,
                ) => Promise<Result<void>>
                getTaskTags: (task_id: string) => Promise<Result<DbTag[]>>
                addTagToTask: (
                    task_id: string,
                    payload: { tag_name: string; color?: string },
                ) => Promise<Result<DbTag>>
                removeTagFromTask: (task_id: string, tag_id: string) => Promise<Result<void>>
            }
        }
    }
}

export {}
