import { app, BrowserWindow, ipcMain, globalShortcut, Tray, Menu, screen } from 'electron';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();
const currentDir = fileURLToPath(new URL('.', import.meta.url));
// console.log('Current Directory:', currentDir);

let mainWindow: BrowserWindow | undefined;
let toolbarWindow: BrowserWindow | undefined;
let settingsWindow: BrowserWindow | undefined;
let tray: Tray | null = null;

// 預設設定
const defaultSettings = {
  pen1Color: '#ff0000', // 紅色
  traceColor: '#ffa500', // 橘色
  rectColor: '#0000ff', // 藍色
  lineWidth: 5,
};

let currentSettings = { ...defaultSettings };

function createSettingsWindow() {
  if (settingsWindow) {
    settingsWindow.focus();
    return;
  }

  if (!mainWindow) {
    return;
  }

  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;

  settingsWindow = new BrowserWindow({
    width: 400,
    height: 450,
    x: Math.floor((screenWidth - 400) / 2),
    y: Math.floor((screenHeight - 450) / 2),
    parent: mainWindow,
    modal: true,
    title: '設定',
    frame: false, // 移除標題列和框架
    resizable: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // For easier IPC
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
    void settingsWindow.loadURL(process.env.APP_URL + '/settings.html');
  } else {
    void settingsWindow.loadFile('settings.html');
  }

  settingsWindow.once('ready-to-show', () => {
    settingsWindow?.show();
    settingsWindow?.webContents.send('settings-data', currentSettings);
  });

  settingsWindow.on('closed', () => {
    settingsWindow = undefined;
  });
}

async function createWindow() {
  /**
   * Initial window options
   */
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;

  // 創建全螢幕繪圖視窗
  mainWindow = new BrowserWindow({
    width: screenWidth,
    height: screenHeight,
    x: 0,
    y: 0,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    show: false,
    skipTaskbar: true,
    transparent: true,
    webPreferences: {
      contextIsolation: true,
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
    await mainWindow.loadURL(process.env.APP_URL + '/drawing.html');
  } else {
    await mainWindow.loadFile('drawing.html');
  }

  mainWindow?.webContents.send('update-settings', currentSettings);

  // 創建工具列子視窗
  toolbarWindow = new BrowserWindow({
    parent: mainWindow,
    icon: path.resolve(currentDir, 'icons/icon.png'), // tray icon
    width: 50,
    height: 330,
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
    await toolbarWindow.loadURL(process.env.APP_URL);
  } else {
    await toolbarWindow.loadFile('index.html');
  }

  // 系統盤圖示
  if (process.env.DEV) {
    tray = new Tray(path.resolve(currentDir, '../../public/icon.png'));
  } else {
    tray = new Tray(path.resolve(currentDir, 'icon.png'));
  }
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '顯示/隱藏 工具列（&F9）',
      type: 'normal',
      click: () => {
        if (mainWindow?.isVisible()) {
          mainWindow.hide();
          toolbarWindow?.hide();
        } else {
          mainWindow?.show();
          mainWindow?.focus();
          toolbarWindow?.show();
          toolbarWindow?.focus();
        }
      },
    },
    {
      label: '設定',
      click: () => {
        createSettingsWindow();
      },
    },
    { type: 'separator' },
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

  toolbarWindow.webContents.on('devtools-opened', () => {
    toolbarWindow?.webContents.closeDevTools();
  });

  mainWindow.on('closed', () => {
    mainWindow = undefined;
  });

  // 監聽渲染進程的 console.log 訊息
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`Renderer Console (${sourceId}:${line}): ${message}`);
  });

  toolbarWindow.on('closed', () => {
    toolbarWindow = undefined;
  });

  // 監聽工具列渲染進程的 console.log 訊息
  toolbarWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`Toolbar Renderer Console (${sourceId}:${line}): ${message}`);
  });

  // 註冊全域快捷鍵 F9 來顯示/隱藏工具列
  globalShortcut.register('F9', () => {
    if (mainWindow?.isVisible()) {
      mainWindow.hide();
      toolbarWindow?.hide();
    } else {
      mainWindow?.show();
      mainWindow?.focus();
      toolbarWindow?.show();
      toolbarWindow?.focus();
    }
  });
}

ipcMain.handle('quit-app', () => {
  app.quit();
});

ipcMain.handle('hide-window', () => {
  if (mainWindow) {
    mainWindow.hide();
    toolbarWindow?.hide();
  }
});

ipcMain.on('clear-canvas', () => {
  console.log('clear-canvas received');
  mainWindow?.webContents.send('clear-drawing');
});

ipcMain.on('set-tool', (event, tool) => {
  console.log('set-tool received in main', tool);
  mainWindow?.webContents.send('set-tool', tool);
});

ipcMain.on('save-settings', (event, newSettings) => {
  currentSettings = newSettings;
  // 將新設定傳遞給繪圖視窗
  mainWindow?.webContents.send('update-settings', currentSettings);
  console.log('Settings saved:', currentSettings);
});

ipcMain.on('restore-settings', () => {
  currentSettings = { ...defaultSettings };
  // 將預設設定傳遞給繪圖視窗
  mainWindow?.webContents.send('update-settings', currentSettings);
  // 同時也將預設設定傳遞給設定視窗，使其更新 UI
  settingsWindow?.webContents.send('settings-data', currentSettings);
  console.log('Settings restored to default');
});

ipcMain.on('toggle-whiteboard', (_event, isWhiteboardMode: boolean) => {
  console.log('toggle-whiteboard received in main', isWhiteboardMode);
  if (mainWindow) {
    if (isWhiteboardMode) {
      mainWindow.setOpacity(1);
      mainWindow.setBackgroundColor('#FFFFFF');
    } else {
      mainWindow.setOpacity(0.5);
      mainWindow.setBackgroundColor('#00000000');
    }
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
