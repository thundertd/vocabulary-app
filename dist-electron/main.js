"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
let mainWindow = null;
let notificationInterval = null;
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    // Load the index.html from a url
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
        // Handle load failures
        mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
            console.error('Failed to load:', errorDescription, 'at', validatedURL);
            // Try to reload after 2 seconds
            setTimeout(() => {
                if (mainWindow) {
                    mainWindow.reload();
                }
            }, 2000);
        });
    }
    else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }
    // Handle window closed
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}
electron_1.app.whenReady().then(() => {
    createWindow();
    // Set up notification interval
    notificationInterval = setInterval(() => {
        new electron_1.Notification({
            title: 'Time to Practice!',
            body: 'Click to start your vocabulary practice session.'
        }).show();
    }, 10 * 60 * 1000); // 10 minutes
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
// IPC handlers
electron_1.ipcMain.handle('read-json-data', async () => {
    try {
        // In development, the data folder is in the project root
        // In production, it would be in the app resources
        let dataPath;
        if (process.env.NODE_ENV === 'development') {
            dataPath = path.join(process.cwd(), 'data/vocabulary.json');
        }
        else {
            dataPath = path.join(__dirname, '../data/vocabulary.json');
        }
        const data = await fs.promises.readFile(dataPath, 'utf-8');
        return JSON.parse(data);
    }
    catch (error) {
        console.error('Error reading JSON data:', error);
        return [];
    }
});
electron_1.ipcMain.handle('get-settings', async () => {
    // TODO: Implement settings storage
    return {
        hintInterval: 20, // seconds
        dailyWordCount: 50
    };
});
electron_1.ipcMain.handle('save-settings', async (_, settings) => {
    // TODO: Implement settings storage
    console.log('Saving settings:', settings);
    return true;
});
electron_1.ipcMain.handle('save-practice-result', async (_, result) => {
    // TODO: Implement practice result storage
    console.log('Saving practice result:', result);
    return true;
});
