import { contextBridge, ipcRenderer } from 'electron'

class ElectronVueTitleBarPreloader {
  initialize = () => {
    const evtbWindowApi = {
      isMaximized: () => ipcRenderer.invoke('evtb:isMaximized'),
      maximize: () => ipcRenderer.invoke('evtb:maximize'),
      minimize: () => ipcRenderer.invoke('evtb:minimize'),
      restore: () => ipcRenderer.invoke('evtb:restore'),
      close: () => ipcRenderer.invoke('evtb:close')
    }
    
    if (process.contextIsolated) {
      try {
        contextBridge.exposeInMainWorld('evtb', evtbWindowApi)
      } catch (error) {
        console.error(error)
      }
    } else {
      window.evtb = evtbWindowApi
    }
  }
}

export default ElectronVueTitleBarPreloader