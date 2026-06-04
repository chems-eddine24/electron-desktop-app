import { ipcMain } from 'electron'
import { IPC } from '../../src/shared/ipc_channels.ts'
import type { TaskService } from '../../src/services/tasks.ts'


interface Services {
    taskService: TaskService,
}

export function taskIpcHandlers({ taskService }: Services) {
    ipcMain.handle(IPC.TASKS_GET_ALL, () =>
        taskService.getAllTasks()
    )

    ipcMain.handle(IPC.TASKS_CREATE, (_, payload, project_id: string) =>
        taskService.createTask(payload, project_id)
    )

    ipcMain.handle(IPC.TASKS_UPDATE, (_, payload) =>
        taskService.updateTask(payload)
    )

    ipcMain.handle(IPC.TASKS_DELETE, (_, project_id: string) =>
        taskService.deleteTask(project_id)
    )
}