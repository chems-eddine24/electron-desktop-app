import { contextBridge, ipcRenderer } from "electron";
import { IPC } from "../src/shared/ipc_channels.ts";
console.log("Preload loaded")
contextBridge.exposeInMainWorld('electronApi', {
    tasks: {
        getAllTasks: ()              => ipcRenderer.invoke(IPC.TASKS_GET_ALL),
        createTask: (payload: unknown) => ipcRenderer.invoke(IPC.TASKS_CREATE, payload),
        updateTask: (payload: unknown) => ipcRenderer.invoke(IPC.TASKS_UPDATE, payload),
        deleteTask: (title: string)    => ipcRenderer.invoke(IPC.TASKS_DELETE, title),
    },
    projects: {
        getAllProjects: () => ipcRenderer.invoke(IPC.PROJECTS_GET_ALL),
        createProject: (payload: unknown) => ipcRenderer.invoke(IPC.PROJECTS_CREATE, payload),
        updateProject: (project_id: number, payload : {archive?: boolean; title?: string; active?: boolean, description?: string}) => ipcRenderer.invoke(IPC.PROJECTS_UPDATE, project_id, payload),
        deleteProject: (project_id: number) => ipcRenderer.invoke(IPC.PROJECTS_DELETE, project_id),
        selectProject: (project_id: number) => ipcRenderer.invoke(IPC.PROJECTS_SELECT, project_id),
    }
})
