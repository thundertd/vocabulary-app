import { app, BrowserWindow, ipcMain, Notification } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

let mainWindow: BrowserWindow | null = null;
let notificationInterval: NodeJS.Timeout | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
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
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
  
  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  // Set up notification interval
  notificationInterval = setInterval(() => {
    new Notification({
      title: 'Time to Practice!',
      body: 'Click to start your vocabulary practice session.'
    }).show();
  }, 10 * 60 * 1000); // 10 minutes

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers
ipcMain.handle('read-json-data', async () => {
  try {
    // In development, the data folder is in the project root
    // In production, it would be in the app resources
    let dataPath: string;
    if (process.env.NODE_ENV === 'development') {
      dataPath = path.join(process.cwd(), 'data/vocabulary.json');
    } else {
      dataPath = path.join(__dirname, '../data/vocabulary.json');
    }
    
    const data = await fs.promises.readFile(dataPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading JSON data:', error);
    return [];
  }
});

ipcMain.handle('get-settings', async () => {
  // TODO: Implement settings storage
  return {
    hintInterval: 20, // seconds
    dailyWordCount: 50
  };
});

ipcMain.handle('save-settings', async (_, settings) => {
  // TODO: Implement settings storage
  console.log('Saving settings:', settings);
  return true;
});

ipcMain.handle('save-practice-result', async (_, result) => {
  // TODO: Implement practice result storage
  console.log('Saving practice result:', result);
  return true;
}); 