import { ipcMain } from 'electron'
import { IPC } from '../shared/ipc_channels.ts'
import type {ProjectService} from '../services/projects.ts'

interface Services {
    projectService: ProjectService
}

export function projectIpcHandlers({projectService }: Services) {
    ipcMain.handle(IPC.PROJECTS_GET_ALL, () =>
        projectService.listActive()
    )

    ipcMain.handle(IPC.PROJECTS_CREATE, (_, payload) =>
        projectService.create(payload)
    )

    ipcMain.handle(IPC.PROJECTS_DELETE, (_, project_id) =>
        projectService.delete(project_id)
    )

    ipcMain.handle(IPC.PROJECTS_UPDATE, (_,project_id, payload) =>
        projectService.update(project_id, payload)
    )

}