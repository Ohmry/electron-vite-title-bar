# Electron Vite Title Bar
이 컴포넌트는 프레임이 없는 일렉트론 앱에서 윈도우 타이틀 바를 구현할 수 있는 컴포넌트입니다. PNG 파일로 된 로고를 설정할 수 있으며, JSON 형태의 메뉴정보를 주입하여 윈도우 메뉴를 생성할 수 있습니다. 또한 윈도우와 관련된 최소화, 최대화, 닫기 버튼들이 존재하며 각각의 버튼에 이벤트를 연결하여 윈도우와 관련된 기능을 구현할 수 있습니다.

# 설치방법 (Installation)
이 컴포넌트는 아래 명령어를 통해서 설치할 수 있습니다.
```bash
# Using NPM
npm install @ohmry/electron-vite-title-bar

# Using Yarn
yarn add @ohmry/electron-vite-title-bar
```

# 사용방법 (How to use)
electron-vite 프로젝트를 기준으로 라이브러리를 설치한 뒤 `main/index.js`, `preload/index.js`, `renderer/App.vue` 파일에 아래와 같이 각각 코드를 추가해주어야합니다.

## main/index.js
main/index.js 파일에는 electron에서 제공하는 윈도우 기능(최소화, 최대화, 닫기 등)을 renderer에서 받아볼 수 있도록 API를 생성해주어야합니다.
아래와 같이 index.js 파일에 코드를 추가합니다.
```javascript
/** main/index.js */
import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

// electron-vite-title-bar-loader 클래스를 불러옵니다.
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

  // electronViteTitleBarLoader를 초기화합니다.
  electronViteTitleBarLoader.initialize(mainWindow)

.. 중략
}
```

## preload/index.js
preload/index.js 파일에서는 ElectronViteTitleBar에서 electron에서 제공하는 윈도우 기능을 호출할 수 있도록 연동하는 API를 생성해주어야합니다.
아래와 같이 index.js 파일에 코드를 추가합니다.
```javascript
/** preload/index.js */
import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// electronViteTitleBarPreloader 클래스를 불러옵니다.
import electronViteTitleBarPreloader from '@ohmry/electron-vite-title-bar/preloader'
// electronViteTitleBarPreloader 클래스를 초기화합니다.
electronViteTitleBarPreloader.initialize()

... 중략
```

## renderer/App.vue
`main/index.js`와 `preload/index.js` 파일에 각각의 클래스를 불러와서 초기화를 완료했다면 일렉트론 앱의 메인이 되는 App.vue 파일에 아래와 같이 컴포넌트를 추가합니다.
또한 스타일이 적용될 수 있도록 스타일 파일도 불러옵니다.
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

# 속성 (Attributes)
### 아이콘 (icon)
아이콘은 타이틀 바의 가장 우측에 표시되며, <img> 태그의 src로 사용될 수 있는 값으로만 지정할 수 있습니다.
```Vue
<template>
  <ElectronViteTitleBar icon="/src/assets/logo.png"></ElectronViteTitleBar>
</template>
```

### 타이틀 (title)
타이틀은 타이틀 바의 가운데에 표시되며, 해당 앱 또는 페이지에 대한 제목을 설정할 수 있습니다.
```Vue
<template>
  <ElectronVueTitleBar title="Title of app or pages"></ElectronVueTitleBar>
</template>
```

### 메뉴 (menu)
메뉴는 JSON 형태의 배열로 구성된 데이터이며, 타이틀 바에 메뉴정보를 주입하여 메뉴를 생성할 수 있습니다. 메뉴는 기본적으로 label 값을 가지고 있으며, 하위 메뉴가 있을 경우 subMenu 항목을 설정하여 하위 메뉴를 구성할 수 있습니다. 또한 hotKey 값을 이용하여 단축키를 설정할 수 있습니다.
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

# 이벤트 (Events)
### onMenuClick: Function => (label)
ElectronViteTitleBar 컴포넌트에 메뉴를 생성하고, 해당 메뉴를 클릭했을 때 이 이벤트를 통해서 어떤 메뉴를 클릭했는지 수신할 수 있습니다.
이벤트를 통해 전달되는 파라미터는 `label` 파라미터이며, 메뉴를 생성할 때 지정하는 `label` 값이 전달됩니다.
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