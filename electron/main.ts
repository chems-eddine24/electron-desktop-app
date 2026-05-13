import dotenv from 'dotenv'
import path from 'path';
import { app, BrowserWindow} from "electron";
import { TaskService } from "../src/services/tasks.ts";
import { TaskRepo } from "../src/repositories/tasks.ts"
import { fileURLToPath } from "url";
import {registerIpcHandlers} from "./router.ts";




const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env'), debug:true })
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
    win.loadURL("http://localhost:5173")

}

app.disableHardwareAcceleration()
app.whenReady().then(() => {
    const taskRepo    = new TaskRepo()
    const taskService = new TaskService(taskRepo)
    registerIpcHandlers({ taskService })
    createWindow();
});

console.log("🔥 MAIN PROCESS STARTED");

