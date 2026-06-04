export type Project = {
    project_id: string;
    title: string;
    description: string;
    created_at: string;
    archive: boolean;
    active: boolean;
};

export type TaskStatus = 'doing' | 'done' | 'paused'

export type TaskTag = {
    id: string;
    name: string;
};

export type Task = {
    task_id: string;
    title: string;
    description: string;
    status: TaskStatus;
    created_at: Date;
    updated_at: Date | null;
    project_id?: string;
};

export type TaskDraft = {
    title: string;
    description: string;
    status: TaskStatus;
    tag_name: string;
};

export const emptyDraft: TaskDraft = {
    title: '',
    description: '',
    status: 'doing',
    tag_name: '',
};
