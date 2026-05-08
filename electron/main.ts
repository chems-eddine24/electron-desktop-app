
import { app, BrowserWindow} from "electron";


function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
    });

    // DEV MODE
    win.loadURL("http://localhost:5173");

    // PRODUCTION MODE
    // win.loadFile(path.join(__dirname, "../dist/index.html"));
}

app.whenReady().then(() => {
    createWindow();
});