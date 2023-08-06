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
import ElectronViteTitleBar from '../../../../src/ElectronViteTitleBar.vue'
import '../../../../src/electron-vite-title-bar-style.css'

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
      { seperator: true },
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
      { seperator: true},
      { label: 'About' }
    ]
  }
]
</script>