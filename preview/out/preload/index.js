"use strict";
const electron = require("electron");
const preload = require("@electron-toolkit/preload");
class ElectronVueTitleBarPreloader {
  initialize = () => {
    const evtbWindowApi = {
      isMaximized: () => electron.ipcRenderer.invoke("evtb:isMaximized"),
      maximize: () => electron.ipcRenderer.invoke("evtb:maximize"),
      minimize: () => electron.ipcRenderer.invoke("evtb:minimize"),
      restore: () => electron.ipcRenderer.invoke("evtb:restore"),
      close: () => electron.ipcRenderer.invoke("evtb:close")
    };
    if (process.contextIsolated) {
      try {
        electron.contextBridge.exposeInMainWorld("evtb", evtbWindowApi);
      } catch (error) {
        console.error(error);
      }
    } else {
      window.evtb = evtbWindowApi;
    }
  };
}
const electronViteTitleBarPreloader = new ElectronVueTitleBarPreloader();
electronViteTitleBarPreloader.initialize();
const api = {};
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
    electron.contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = preload.electronAPI;
  window.api = api;
}
