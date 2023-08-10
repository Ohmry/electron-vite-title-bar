# Electrion Vite Title Bar
You can use this component for window title bar instead of native window title bar in frameless electron-vite application.

## Quick Start
### Installation
Install this package by npm or yarn.
```bash
# NPM
npm install @ohmry/electron-vite-title-bar

# Yarn
yarn add @ohmry/electron-vite-title-bar
```

### Import and initialize
Import and initialize in `main/index.js` and `preload/index.js`.
#### main/index.js
```javascript
import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

// Import class and create instance
import ElectronViteTitleBarLoader from '@ohmry/electron-vite-title-bar/loader'
const electronViteTitleBarLoader = new ElectronViteTitleBarLoader()

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // Initialize
  electronViteTitleBarLoader.initialize(mainWindow)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  ...
```

#### preload/index.js
```javascript
import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Import and initialize
import ElectronViteTitleBarPreloader from '@ohmry/electron-vite-title-bar/preloader'
const electronViteTitleBarPreloader = new ElectronViteTitleBarPreloader()
electronViteTitleBarPreloader.initialize()
...
```

### Using component
After intialize, you can use component in App.vue like this.
#### App.vue
```Vue
<template>
  <ElectronViteTitleBar
    icon="src/assets/icon.png"
    title="Electron Vite Title Bar"
    :menu="menu"
    @onMenuClick="(e) => console.log(e)">
  </ElectronViteTitleBar>
  <div>Hello World!</div>
</template>
<script setup>
import ElectronViteTitleBar from '@ohmry/electron-vite-title-bar'
import '@ohmry/electron-vite-title-bar/dist/style.css'

const menu = [
  {
    label: 'File',
    subMenu: [
      { label: 'New', hotKey: 'Ctrl+N' },
      { label: 'Open', hotKey: 'Ctrl+O' },
      { label: 'Open Recent' }
    ]
  },
  {
    label: 'Edit',
    subMenu: [
      { label: 'Undo' },
      { label: 'Redo' },
      { separator: true },
      { label: 'Cut', hotKey: 'Ctrl+X' },
      { label: 'Copy', hotKey: 'Ctrl+C' },
      { label: 'Paste', hotKey: 'Ctrl+V' }
    ]
  },
  {
    label: 'Select',
    subMenu: [
      { label: 'Select Line' },
      { label: 'Select All' }
    ]
  },
  {
    label: 'Help',
    subMenu: [
      { label: 'View License' },
      { label: 'Report Issue' },
      { separator: true},
      { label: 'About' }
    ]
  }
]
</script>
```