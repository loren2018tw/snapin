import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  quitApp: () => ipcRenderer.invoke('quit-app'),
  hideWindow: () => ipcRenderer.invoke('hide-window'),
  toggleWhiteboard: (isWhiteboardMode: boolean) =>
    ipcRenderer.send('toggle-whiteboard', isWhiteboardMode),
  send: (channel: string, ...args: unknown[]) => ipcRenderer.send(channel, ...args),
  on: (channel: string, callback: (...args: unknown[]) => void) => {
    ipcRenderer.on(channel, (_event, ...args) => callback(...args));
  },
});
