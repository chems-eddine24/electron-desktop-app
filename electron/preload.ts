import { contextBridge, ipcRenderer } from "electron";
import { IPC } from "../src/shared/ipc_channels.ts";
console.log("Preload loaded")
contextBridge.exposeInMainWorld('electronApi', {
    tasks: {
        getAllTasks: ()              => ipcRenderer.invoke(IPC.TASKS_GET_ALL),
        createTask: (payload: unknown, project_id: string) => ipcRenderer.invoke(IPC.TASKS_CREATE, payload, project_id),
        updateTask: (payload: unknown) => ipcRenderer.invoke(IPC.TASKS_UPDATE, payload),
        deleteTask: (project_id: string)    => ipcRenderer.invoke(IPC.TASKS_DELETE, project_id),
    },
    projects: {
        getAllProjects: () => ipcRenderer.invoke(IPC.PROJECTS_GET_ALL),
        createProject: (payload: unknown) => ipcRenderer.invoke(IPC.PROJECTS_CREATE, payload),
        updateProject: (project_id: string, payload : {archive?: boolean; title?: string; active?: boolean, description?: string}) => ipcRenderer.invoke(IPC.PROJECTS_UPDATE, project_id, payload),
        deleteProject: (project_id: string) => ipcRenderer.invoke(IPC.PROJECTS_DELETE, project_id),
    }
})
