"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const icon = path.join(__dirname, "../../resources/icon.png");
class ElectronVueTitleBarLoader {
  initialize = (mainWindow) => {
    electron.ipcMain.handle("evtb:isMaximized", () => {
      return mainWindow.isMaximized();
    });
    electron.ipcMain.handle("evtb:maximize", () => {
      mainWindow.maximize();
    });
    electron.ipcMain.handle("evtb:minimize", () => {
      mainWindow.minimize();
    });
    electron.ipcMain.handle("evtb:restore", () => {
      mainWindow.restore();
    });
    electron.ipcMain.handle("evtb:close", () => {
      mainWindow.close();
    });
  };
}
const electronViteTitleBarLoader = new ElectronVueTitleBarLoader();
function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...process.platform === "linux" ? { icon } : {},
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false
    }
  });
  electronViteTitleBarLoader.initialize(mainWindow);
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.electron");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  createWindow();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0)
      createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
