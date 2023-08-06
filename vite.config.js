import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      // entry: path.resolve(__dirname, 'src/index.js'),
      entry: [
        path.resolve(__dirname, 'src/index.js'),
        path.resolve(__dirname, 'src/electron-vite-title-bar-loader.js'),
        path.resolve(__dirname, 'src/electron-vite-title-bar-preloader.js')
      ],
      name: 'ElectronVueTitleBar',
      // fileName: (format) => `electron-vue-title-bar.${format}.js`,
      fileName: (format, entryName) => {
        return `${entryName}.${format}.js`
      }
    },
    rollupOptions: {
      external: ['vue', 'electron'],
      input: {
        'components': 'src/index.js',
        'loader': 'src/electron-vite-title-bar-loader.js',
        'preloader': 'src/electron-vite-title-bar-preloader.js'
      },
      output: {
        // Provide global variables to use in the UMD build
        // Add external deps here
        globals: {
          vue: 'Vue',
          electron: 'electron'
        },
      },
    },
  },
  plugins: [vue()]
});