# Electron Vite Title Bar
이 컴포넌트는 프레임이 없는 일렉트론 앱에서 윈도우 타이틀 바를 구현할 수 있는 컴포넌트입니다. PNG 파일로 된 로고를 설정할 수 있으며, JSON 형태의 메뉴정보를 주입하여 윈도우 메뉴를 생성할 수 있습니다. 또한 윈도우와 관련된 최소화, 최대화, 닫기 버튼들이 존재하며 윈도우 창에 대한 기능을 처리할 수 있습니다.

Use this component instead of window title bar in frameless electron-vite application. you can set logo(eg. icon.png) and create menu into component. this components has buttons that has window userinterface functions like minimize, maximize, restore and close and you can handle window functions by buttons. 

## 설치방법 (Installation)
이 컴포넌트는 아래 명령어를 통해서 설치할 수 있습니다.

You can install this component using command below.
```bash
# Using NPM
npm install @ohmry/electron-vite-title-bar

# Using Yarn
yarn add @ohmry/electron-vite-title-bar
```

## 사용방법 (How to use)
electron-vite 프로젝트를 기준으로 라이브러리를 설치한 뒤 `main/index.js`, `preload/index.js`, `renderer/App.vue` 파일에 아래와 같이 각각 코드를 추가해주어야합니다.

After install this component, you have to add some code in `main/index.js`, `preload/index.js` and `renderer/App.vue`.
### main/index.js
main/index.js 파일에서는 ElectronViteTitleBarLoader 클래스를 가져와서 초기화를 진행해야합니다. 이 초기화는 Renderer에서 호출되는 함수를 일렉트론에서 수신하고, 일렉트론에서 제공하는 윈도우관련 기능을 수행할 수 있도록 함수를 생성합니다. ElectronViteTitleBarLoader 클래스를 초기화할 때, BrowserWindow 객체를 매개변수로 전달받아야함으로 아래와 같이 코드를 추가합니다.

Import ElectronViteTitleBarLoader instance and call initialize(). it creates ipcMain.handle functions which do window functions (eg. minimize, maximize, restore and close). `initialize` function needs parameter of `BrowserWindow` instance. so you have to add initialize code like below code.
```javascript
/** main/index.js */
import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

// #1. electron-vite-title-bar-loader 클래스를 불러옵니다.
import electronViteTitleBarLoader from '@ohmry/electron-vite-title-bar/loader'

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

  // #2. electronViteTitleBarLoader를 초기화합니다.
  electronViteTitleBarLoader.initialize(mainWindow)

.. 중략
}
```

### preload/index.js
preload/index.js 파일에서는 ElectronViteTitleBarPreloader 클래스를 가져와서 초기화를 진행해야합니다. 이 초기화를 통해 일렉트론에서 제공하는 윈도우관련 기능을 Renderer 내부 코드에서 사용할 수 있도록 함수를 생성합니다.

Import ElectronViteTitleBarPreloader instance and call intialize(). it creates window functions (eg. minimize, maximize, restore and close) for using this functions in renderer source codes.
```javascript
/** preload/index.js */
import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// #1. electronViteTitleBarPreloader 클래스를 불러옵니다.
import electronViteTitleBarPreloader from '@ohmry/electron-vite-title-bar/preloader'
// #2. electronViteTitleBarPreloader 클래스를 초기화합니다.
electronViteTitleBarPreloader.initialize()

... 중략
```

### renderer/App.vue
`main/index.js`와 `preload/index.js` 파일에 각각의 클래스를 불러와서 초기화를 완료했다면 일렉트론 앱의 메인이 되는 App.vue 파일에 아래와 같이 컴포넌트를 추가합니다. 컴포넌트를 추가할 때, 스타일이 적용될 수 있도록 스타일 파일도 불러옵니다.

After initialize in `main/index.js` and `preload/index.js`, you can using this component in App.vue like this. when importing component, you have to import style.css also.
```Vue
<template>
  <ElectronViteTitleBar
    title="Electron Vite Title Bar">
  </ElectronViteTitleBar>
  <div>Hello World!</div>
</template>
<script setup>
import { ElectronViteTitleBar } from '@ohmry/electron-vite-title-bar'
import '@ohmry/electron-vite-title-bar/dist/style.css'

...중략
</script>
```

## 속성 (Attributes)
### 아이콘 (icon)
아이콘은 타이틀 바의 가장 우측에 표시되며, <img> 태그의 src로 사용될 수 있는 값으로만 지정할 수 있습니다.

Icon put right side in title bar. you can set icon value that be used to src from <img> tag.
```Vue
<template>
  <ElectronViteTitleBar icon="/src/assets/logo.png"></ElectronViteTitleBar>
</template>
```

### 타이틀 (title)
타이틀은 타이틀 바의 가운데에 표시되며, 해당 앱 또는 페이지에 대한 제목을 설정할 수 있습니다.

Title put center in title bar. you can set title of page or app.
```Vue
<template>
  <ElectronVueTitleBar title="Title of app or pages"></ElectronVueTitleBar>
</template>
```

### 메뉴 (menu)
메뉴는 JSON 형태의 배열로 구성된 데이터이며, 타이틀 바에 메뉴정보를 주입하여 메뉴를 생성할 수 있습니다. 메뉴는 기본적으로 label 값을 가지고 있으며, 하위 메뉴가 있을 경우 subMenu 항목을 설정하여 하위 메뉴를 구성할 수 있습니다. 또한 hotKey 값을 이용하여 단축키를 설정할 수 있습니다.

You can create menu in title bar by inject information of menu that consist of JSON array. item of menu has String value called `label` basically. and if you create sub menu, you can set value called `subMenu` that consist of JSON array. if you want to create seperator, set `sererator` value is true. and this item should not have `label` or `subMenu`. if you create hotkey of menu, you can set value called `hotkey`.
```Vue
<template>
  <ElectronVueTitleBar :menu="menu"></ElectronVueTitleBar>
</template>

<script setup>
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
```

## 이벤트 (Events)
### onMenuClick: Function => (label)
ElectronViteTitleBar 컴포넌트에 생성된 메뉴를 클릭했을 때, 클릭한 메뉴의 정보를 얻기 위해서는 아래와 같이 이 이벤트를 구독하면 값을 얻을 수 있습니다. 이벤트로 전달되는 값은 메뉴의 `label` 값이 전달됩니다.

If you want to get value of label of menu clicked, subscribe this function.
```Vue
<template>
  <ElectronVueTitleBar
    :menu="menu"
    @onMenuClick="onMenuClick">
  </ElectronVueTitleBar>
</template>

<script setup>
/**
 * 메뉴를 클릭했을 때, 발생하는 이벤트입니다.
 * 메뉴에 지정된 label 값이 파라미터로 전달됩니다.
 * @param {메뉴의 라벨} label 
 */
const onMenuClick = (label) => {
  console.log('Click to ' + label)
}

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
```