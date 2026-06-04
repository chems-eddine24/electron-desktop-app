
import path from 'path';
import { app, BrowserWindow} from "electron";
import { TaskService } from "./services/tasks.ts";
import { TaskRepo } from "./repositories/tasks.ts"
import {ProjectRepo} from "./repositories/projects.ts"
import {ProjectService} from "./services/projects.ts"
import { fileURLToPath } from "url";
import {projectIpcHandlers} from "./controllers/projects.ts";
import {taskIpcHandlers} from "./controllers/tasks.ts";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, '/preload.ts'),
            sandbox: false,
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    // DEV MODE
    win.loadURL("http://localhost:5174")

}

app.disableHardwareAcceleration()
app.whenReady().then(() => {
    const taskRepo    = new TaskRepo()
    const taskService = new TaskService(taskRepo)
    const projectRepo = new ProjectRepo()
    const projectService = new ProjectService(projectRepo)
    taskIpcHandlers({taskService})
    projectIpcHandlers({projectService})
    createWindow();
});

console.log("🔥 MAIN PROCESS STARTED");

