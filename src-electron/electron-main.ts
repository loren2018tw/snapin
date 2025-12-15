import { app, BrowserWindow, ipcMain, globalShortcut, Tray, Menu, screen } from 'electron';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

const currentDir = fileURLToPath(new URL('.', import.meta.url));

let mainWindow: BrowserWindow | undefined;
let tray: Tray | null = null;

async function createWindow() {
  /**
   * Initial window options
   */
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    icon: path.resolve(currentDir, 'icons/icon.png'), // tray icon
    width: 50,
    height: 250,
    x: screenWidth - 80,
    y: Math.floor((screenHeight - 200) / 2),
    frame: false, // 移除標題列和框架
    resizable: false, // 不允許調整大小
    alwaysOnTop: true, // 保持在最上層
    show: false, // 預設隱藏
    skipTaskbar: true, // 不顯示在任務列
    type: 'toolbar', // 隱藏從視窗清單
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(
        currentDir,
        path.join(
          process.env.QUASAR_ELECTRON_PRELOAD_FOLDER,
          'electron-preload' + process.env.QUASAR_ELECTRON_PRELOAD_EXTENSION,
        ),
      ),
    },
  });

  if (process.env.DEV) {
    await mainWindow.loadURL(process.env.APP_URL);
  } else {
    await mainWindow.loadFile('index.html');
  }

  // 系統盤圖示
  if (process.env.DEV) {
    tray = new Tray(path.resolve(currentDir, '../../src-electron/statics/icon.png'));
  } else {
    tray = new Tray(path.resolve(currentDir, 'statics/icon.png'));
  }
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '顯示/隱藏 工具列（&F9）',
      type: 'normal',
      click: () => {
        if (mainWindow?.isVisible()) {
          mainWindow.hide();
        } else {
          mainWindow?.show();
        }
      },
    },
    {
      label: '結束程式',
      type: 'normal',
      click: () => {
        app.quit();
      },
    },
  ]);
  tray.setToolTip('SnapIn 螢幕標註工具');
  tray.setContextMenu(contextMenu);

  // 不開啟開發者工具
  mainWindow.webContents.on('devtools-opened', () => {
    mainWindow?.webContents.closeDevTools();
  });

  mainWindow.on('closed', () => {
    mainWindow = undefined;
  });

  // 註冊全域快捷鍵 F9 來顯示/隱藏工具列
  globalShortcut.register('F9', () => {
    if (mainWindow?.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow?.show();
    }
  });
}

ipcMain.handle('quit-app', () => {
  app.quit();
});

ipcMain.handle('hide-window', () => {
  if (mainWindow) {
    mainWindow.hide();
  }
});

void app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  globalShortcut.unregisterAll();
  if (platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('activate', () => {
  if (mainWindow === undefined) {
    createWindow().catch(console.error);
  }
});
