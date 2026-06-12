import type { Task as DbTask, TaskStatus } from '../../../electron/lib/types.ts'
import type { Project as DbProject } from '../../../electron/lib/types.ts'
import type { Task, Project, Tag } from '@/hooks/useWorkOrganizerState'
import { mapDbTag } from '@/lib/tag-colors'

export type UiTaskStatus = Task['status']

const uiToDbStatus: Record<UiTaskStatus, TaskStatus> = {
    todo: 'paused',
    'in-progress': 'doing',
    done: 'done',
}

const dbToUiStatus: Record<TaskStatus, UiTaskStatus> = {
    paused: 'todo',
    doing: 'in-progress',
    done: 'done',
}

export function mapDbProject(
    row: DbProject,
    taskCount = 0,
    tags: Tag[] = [],
): Project {
    return {
        id: row.project_id,
        name: row.title,
        description: row.description ?? '',
        tags,
        createdAt: new Date(row.created_at),
        taskCount,
    }
}

export function mapDbTask(row: DbTask, tags: Tag[] = []): Task {
    const status = dbToUiStatus[row.status as TaskStatus] ?? 'todo'
    return {
        id: row.task_id,
        projectId: row.project_id ?? '',
        title: row.title,
        description: row.description ?? '',
        status,
        priority: 'medium',
        tags,
        createdAt: new Date(row.created_at),
    }
}

export function mapDbTags(rows: { tag_id: string; tag_name: string; tag_color: string }[]): Tag[] {
    return rows.map(mapDbTag)
}

export function toDbStatus(status: UiTaskStatus): TaskStatus {
    return uiToDbStatus[status]
}
