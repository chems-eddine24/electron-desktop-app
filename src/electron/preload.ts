import { contextBridge, ipcRenderer } from 'electron'
import { IPC } from './shared/ipc_channels.ts'

console.log('Preload loaded')
contextBridge.exposeInMainWorld('electronApi', {
    tasks: {
        getAllTasks: () => ipcRenderer.invoke(IPC.TASKS_GET_ALL),
        createTask: (payload: unknown, project_id: string) =>
            ipcRenderer.invoke(IPC.TASKS_CREATE, payload, project_id),
        updateTask: (payload: unknown) => ipcRenderer.invoke(IPC.TASKS_UPDATE, payload),
        deleteTask: (task_id: string) => ipcRenderer.invoke(IPC.TASKS_DELETE, task_id),
    },
    projects: {
        getAllProjects: () => ipcRenderer.invoke(IPC.PROJECTS_GET_ALL),
        createProject: (payload: unknown) => ipcRenderer.invoke(IPC.PROJECTS_CREATE, payload),
        updateProject: (
            project_id: string,
            payload: {
                archive?: boolean
                title?: string
                active?: boolean
                description?: string
            },
        ) => ipcRenderer.invoke(IPC.PROJECTS_UPDATE, project_id, payload),
        deleteProject: (project_id: string) => ipcRenderer.invoke(IPC.PROJECTS_DELETE, project_id),
    },
    tags: {
        getAllTags: () => ipcRenderer.invoke(IPC.TAGS_GET_ALL),
        createTag: (payload: { tag_name: string; color?: string }) =>
            ipcRenderer.invoke(IPC.TAGS_CREATE, payload),
        deleteTag: (tag_id: string) => ipcRenderer.invoke(IPC.TAGS_DELETE, tag_id),
        getProjectTags: (project_id: string) =>
            ipcRenderer.invoke(IPC.TAGS_GET_PROJECT, project_id),
        addTagToProject: (project_id: string, payload: { tag_name: string; color?: string }) =>
            ipcRenderer.invoke(IPC.TAGS_ADD_TO_PROJECT, project_id, payload),
        removeTagFromProject: (project_id: string, tag_id: string) =>
            ipcRenderer.invoke(IPC.TAGS_REMOVE_FROM_PROJECT, project_id, tag_id),
        getTaskTags: (task_id: string) => ipcRenderer.invoke(IPC.TAGS_GET_TASK, task_id),
        addTagToTask: (task_id: string, payload: { tag_name: string; color?: string }) =>
            ipcRenderer.invoke(IPC.TAGS_ADD_TO_TASK, task_id, payload),
        removeTagFromTask: (task_id: string, tag_id: string) =>
            ipcRenderer.invoke(IPC.TAGS_REMOVE_FROM_TASK, task_id, tag_id),
    },
})
