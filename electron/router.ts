import { ipcMain } from 'electron'
import { IPC } from '../src/shared/ipc_channels.ts'
import type { TaskService } from '../src/services/tasks.ts'
import type {ProjectService} from '../src/services/projects.ts'

interface Services {
    taskService: TaskService,
    projectService: ProjectService
}

export function registerIpcHandlers({ taskService, projectService }: Services) {
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
    ipcMain.handle(IPC.PROJECTS_GET_ALL, () =>
    projectService.listActive()
    )

    ipcMain.handle(IPC.PROJECTS_CREATE, (_, payload) =>
    projectService.create(payload)
    )

    ipcMain.handle(IPC.PROJECTS_DELETE, (_, project_id) =>
    projectService.delete(project_id)
    )

    ipcMain.handle(IPC.PROJECTS_UPDATE, (_, {payload, project_id}) =>
    projectService.update(project_id, payload)
    )

}