import { contextBridge, ipcRenderer } from "electron";
//#region src/shared/ipc_channels.ts
var IPC = {
	TASKS_GET_ALL: "tasks:getAll",
	TASKS_CREATE: "tasks:create",
	TASKS_UPDATE: "tasks:update",
	TASKS_DELETE: "tasks:delete",
	PROJECTS_GET_ALL: "projects:getAll",
	PROJECTS_CREATE: "projects:create",
	PROJECTS_UPDATE: "projects:update",
	PROJECTS_DELETE: "projects:delete"
};
//#endregion
//#region electron/preload.ts
console.log("Preload loaded");
contextBridge.exposeInMainWorld("electronApi", {
	tasks: {
		getAllTasks: () => ipcRenderer.invoke(IPC.TASKS_GET_ALL),
		createTask: (payload) => ipcRenderer.invoke(IPC.TASKS_CREATE, payload),
		updateTask: (payload) => ipcRenderer.invoke(IPC.TASKS_UPDATE, payload),
		deleteTask: (title) => ipcRenderer.invoke(IPC.TASKS_DELETE, title)
	},
	projects: {
		getAllProjects: () => ipcRenderer.invoke(IPC.PROJECTS_GET_ALL),
		createProject: (payload) => ipcRenderer.invoke(IPC.PROJECTS_CREATE, payload),
		updateProject: (payload) => ipcRenderer.invoke(IPC.PROJECTS_UPDATE, payload),
		deleteProjects: (project_id) => ipcRenderer.invoke(IPC.PROJECTS_DELETE, project_id)
	}
});
//#endregion
