import { contextBridge, ipcRenderer } from "electron";
//#region src/shared/ipc_channels.ts
var IPC = {
	TASKS_GET_ALL: "tasks:getAll",
	TASKS_CREATE: "tasks:create",
	TASKS_UPDATE: "tasks:update",
	TASKS_DELETE: "tasks:delete"
};
//#endregion
//#region electron/preload.ts
console.log("Preload loaded");
contextBridge.exposeInMainWorld("electronApi", { tasks: {
	getAll: () => ipcRenderer.invoke(IPC.TASKS_GET_ALL),
	create: (payload) => ipcRenderer.invoke(IPC.TASKS_CREATE, payload),
	update: (payload) => ipcRenderer.invoke(IPC.TASKS_UPDATE, payload),
	delete: (title) => ipcRenderer.invoke(IPC.TASKS_DELETE, title)
} });
//#endregion
