export type Project = {
    project_id: string
    title: string
    description: string
    created_at: string | Date
    archive: boolean
    active: boolean
}

export type TaskStatus = 'doing' | 'done' | 'paused'

export type TaskTag = {
    id: string
    name: string
}

export type Task = {
    task_id: string
    title: string
    description: string
    status: TaskStatus
    created_at: Date | string
    updated_at: Date | string | null
    project_id?: string | null
}

export type TaskDraft = {
    title: string
    description: string
    status: TaskStatus
    tag_name: string
}

export const emptyDraft: TaskDraft = {
    title: '',
    description: '',
    status: 'doing',
    tag_name: '',
}
