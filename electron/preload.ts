import { contextBridge, ipcRenderer } from "electron";
import { IPC } from "../src/shared/ipc_channels.ts";
console.log("Preload loaded")
contextBridge.exposeInMainWorld('electronApi', {
    tasks: {
        getAll: ()              => ipcRenderer.invoke(IPC.TASKS_GET_ALL),
        create: (payload: unknown) => ipcRenderer.invoke(IPC.TASKS_CREATE, payload),
        update: (payload: unknown) => ipcRenderer.invoke(IPC.TASKS_UPDATE, payload),
        delete: (title: string)    => ipcRenderer.invoke(IPC.TASKS_DELETE, title),
    }
})