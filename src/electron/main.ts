import path from 'path'

import { app, BrowserWindow } from 'electron'
import { projectIpcHandlers } from './controllers/projects.ts'
import { taskIpcHandlers } from './controllers/tasks.ts'
import { tagIpcHandlers } from './controllers/tags.ts'
import {buildContainer} from "../container.ts";

const projectRoot = process.cwd()

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            preload: path.join(projectRoot, 'dist-electron/preload.cjs'),
            sandbox: false,
            contextIsolation: true,
            nodeIntegration: false,
        },
    })

    const devServerUrl =
        process.env.VITE_DEV_SERVER_URL ?? 'http://localhost:5173'
    if (!app.isPackaged) {
        win.loadURL(devServerUrl)
    } else {
        win.loadFile(path.join(projectRoot, 'dist/index.html'))
    }
}

app.disableHardwareAcceleration()
app.whenReady().then(() => {
    const { taskService, projectService, tagService } = buildContainer()
    taskIpcHandlers({ taskService })
    projectIpcHandlers({ projectService })
    tagIpcHandlers({ tagService })
    createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
