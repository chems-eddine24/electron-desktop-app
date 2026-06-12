import { ipcMain } from 'electron'
import { IPC } from '../shared/ipc_channels.ts'
import type { TagService } from '../services/tags.ts'

interface Services {
    tagService: TagService
}

export function tagIpcHandlers({ tagService }: Services) {
    ipcMain.handle(IPC.TAGS_GET_ALL, () => tagService.getAllTags())

    ipcMain.handle(IPC.TAGS_CREATE, (_, payload) => tagService.createTag(payload))

    ipcMain.handle(IPC.TAGS_DELETE, (_, tag_id: string) => tagService.deleteTag(tag_id))

    ipcMain.handle(IPC.TAGS_GET_PROJECT, (_, project_id: string) =>
        tagService.getProjectTags(project_id),
    )

    ipcMain.handle(IPC.TAGS_ADD_TO_PROJECT, (_, project_id: string, payload) =>
        tagService.addTagToProject(project_id, payload),
    )

    ipcMain.handle(IPC.TAGS_REMOVE_FROM_PROJECT, (_, project_id: string, tag_id: string) =>
        tagService.removeTagFromProject(project_id, tag_id),
    )

    ipcMain.handle(IPC.TAGS_GET_TASK, (_, task_id: string) => tagService.getTaskTags(task_id))

    ipcMain.handle(IPC.TAGS_ADD_TO_TASK, (_, task_id: string, payload) =>
        tagService.addTagToTask(task_id, payload),
    )

    ipcMain.handle(IPC.TAGS_REMOVE_FROM_TASK, (_, task_id: string, tag_id: string) =>
        tagService.removeTagFromTask(task_id, tag_id),
    )
}
