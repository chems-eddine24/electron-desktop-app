import path from 'path'

import { app, BrowserWindow } from 'electron'
import { TaskService } from './services/tasks.ts'
import { TaskRepo } from './repositories/tasks.ts'
import { ProjectRepo } from './repositories/projects.ts'
import { ProjectService } from './services/projects.ts'
import { projectIpcHandlers } from './controllers/projects.ts'
import { taskIpcHandlers } from './controllers/tasks.ts'
import { TagRepo } from './repositories/tags.ts'
import { TagService } from './services/tags.ts'
import { tagIpcHandlers } from './controllers/tags.ts'

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
    const taskRepo = new TaskRepo()
    const taskService = new TaskService(taskRepo)
    const projectRepo = new ProjectRepo()
    const projectService = new ProjectService(projectRepo)
    const tagRepo = new TagRepo()
    const tagService = new TagService(tagRepo)
    taskIpcHandlers({ taskService })
    projectIpcHandlers({ projectService })
    tagIpcHandlers({ tagService })
    createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
