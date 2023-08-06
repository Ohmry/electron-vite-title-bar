# Electron Vue Title Bar
이 컴포넌트는 프레임이 없는 일렉트론 앱에서 윈도우 타이틀 바를 구현할 수 있는 컴포넌트입니다. PNG 파일로 된 로고를 설정할 수 있으며, JSON 형태의 메뉴정보를 주입하여 윈도우 메뉴를 생성할 수 있습니다. 또한 윈도우와 관련된 최소화, 최대화, 닫기 버튼들이 존재하며 각각의 버튼에 이벤트를 연결하여 윈도우와 관련된 기능을 구현할 수 있습니다.

This component can using instead of window title bar in frameless electron-vue. You can set logo that .png file and also create window menu by data composed by json format. It has buttons such as minimize, maximize, restore and close. you can implement window functions by binding event to buttons.

# 설치방법 (Installation)
이 컴포넌트는 아래 명령어를 통해서 설치할 수 있습니다.

You can install this component in your app below command
```bash
# Using NPM
npm install @ohmry/electron-vue-title-bar

# Using Yarn
yarn add @ohmry/electron-vue-title-bar
```

# 사용방법 (How to use)
라이브러리를 설치한 뒤 App.vue 파일에 아래와 같이 컴포넌트를 추가합니다. 컴포넌트에는 Props와 Event 들이 존재하며,
각각의 역할에 맞는 값 또는 함수를 연결해주어야합니다.

After installing library, insert below codes in App.vue. <ElectronVueTitleBar> component has some props and events. so put a value of props or implement each events.

```Vue
// App.vue
<template>
  <ElectronVueTitleBar
    :icon="{icon path}"
    :title="{title}"
    :menu="{menuInfo}"
    :isWindowMaximized="{Boolean isWindowMaximized}"
    @onMinimize="{Function minimizeWindow}"
    @onMaximize="{Function maximizeWindow}"
    @onRestore="{Function restoreWindow}"
    @onClose="{Function closeWindow}"
    @onMenuClick="{Function clickMenu}"
  ></ElectronVueTitlebar>
</template>
<script setup>
import { ElectronVueTitleBar } from '@ohmry/electron-vue-title-bar'
import '@ohmry/electron-vue-title-bar/dist/style.css'
</script>
```

### 아이콘 (icon)
아이콘은 타이틀 바의 가장 우측에 표시되며, <img> 태그의 src로 사용될 수 있는 값으로만 지정할 수 있습니다.

icon presents right side on title bar. you can set value and it is value of src in <img>.
```Vue
<template>
  <ElectronVueTitleBar :icon="/src/assets/logo.png"></ElectronVueTitleBar>
</template>
```

### 타이틀 (title)
타이틀은 타이틀 바의 가운데에 표시되며, 해당 앱 또는 페이지에 대한 제목을 설정할 수 있습니다.

title presents center on title bar. you can set title of app or page.
```Vue
<template>
  <ElectronVueTitleBar :title="Title of app or pages"></ElectronVueTitleBar>
</template>
```

### 메뉴 (menu)
메뉴는 JSON 형태의 배열로 구성된 데이터이며, 타이틀 바에 메뉴정보를 주입하여 메뉴를 생성할 수 있습니다. 메뉴는 기본적으로 label 값을 가지고 있으며, 하위 메뉴가 있을 경우 subMenu 항목을 설정하여 하위 메뉴를 구성할 수 있습니다. 또한 hotKey 값을 이용하여 단축키를 설정할 수 있습니다.

a value of menu is array that consist of json. you can create menu by set a value into menu props in component.

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