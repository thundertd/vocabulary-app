import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'api', {
    readJsonData: () => ipcRenderer.invoke('read-json-data'),
    getSettings: () => ipcRenderer.invoke('get-settings'),
    saveSettings: (settings: any) => ipcRenderer.invoke('save-settings', settings),
    savePracticeResult: (result: any) => ipcRenderer.invoke('save-practice-result', result)
  }
); 