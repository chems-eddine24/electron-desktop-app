import dotenv from 'dotenv'
import path from 'path';
import { app, BrowserWindow} from "electron";
import { TaskService } from "../src/services/tasks.ts";
import { TaskRepo } from "../src/repositories/tasks.ts"
import { db } from '../src/db/index.ts'
import { fileURLToPath } from "url";
import {registerIpcHandlers} from "./router.ts";


console.log(process.env.DATABASE_URL)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env'), debug:true })
function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, '/preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    // DEV MODE
    win.loadURL("http://localhost:5173")

}


app.whenReady().then(() => {
    const taskRepo    = new TaskRepo(db)
    const taskService = new TaskService(taskRepo)
    registerIpcHandlers({ taskService })
    createWindow();
});

console.log("🔥 MAIN PROCESS STARTED");

