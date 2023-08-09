import { ipcMain } from 'electron'

class ElectronVueTitleBarLoader {
  initialize(mainWindow) {
    ipcMain.handle('evtb:isMaximized', () => { return mainWindow.isMaximized() })
    ipcMain.handle('evtb:maximize', () => { mainWindow.maximize() })
    ipcMain.handle('evtb:minimize', () => { mainWindow.minimize() })
    ipcMain.handle('evtb:restore', () => { mainWindow.restore() })
    ipcMain.handle('evtb:close', () => { mainWindow.close() })
  }
}

export default ElectronVueTitleBarLoader