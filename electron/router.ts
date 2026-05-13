import { ipcMain } from 'electron'
import { IPC } from '../src/shared/ipc_channels.ts'
import type { TaskService } from '../src/services/tasks.ts'

interface Services {
    taskService: TaskService
}

export function registerIpcHandlers({ taskService }: Services) {
    ipcMain.handle(IPC.TASKS_GET_ALL, () =>
        taskService.getAll()
    )

    ipcMain.handle(IPC.TASKS_CREATE, (_, payload) =>
        taskService.createTask(payload)
    )

    ipcMain.handle(IPC.TASKS_UPDATE, (_, payload) =>
        taskService.updateTask(payload)
    )

    ipcMain.handle(IPC.TASKS_DELETE, (_, title) =>
        taskService.deleteTask(title)
    )
}