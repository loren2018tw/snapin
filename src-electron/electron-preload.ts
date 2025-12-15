import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  quitApp: () => ipcRenderer.invoke('quit-app'),
  hideWindow: () => ipcRenderer.invoke('hide-window'),
});
