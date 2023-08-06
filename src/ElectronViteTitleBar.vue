<template>
  <section ref="container" class="evtb-container">
    <section v-if="props.icon" class="evtb-logo-container">
      <img class="evtb-logo" :src="props.icon"/>
    </section>
    <section class="evtb-menu-container"></section>
    <section v-if="props.title" class="evtb-title-container">
      {{ props.title }}
    </section>
    <section class="evtb-button-container">
      <ElectronViteTitleBarButton @click="onMinimize" role="minimize"></ElectronViteTitleBarButton>
      <ElectronViteTitleBarButton @click="onMaximize" v-if="!isWindowMaximized" role="maximize"></ElectronViteTitleBarButton>
      <ElectronViteTitleBarButton @click="onRestore" v-if="isWindowMaximized" role="restore"></ElectronViteTitleBarButton>
      <ElectronViteTitleBarButton @click="onClose" role="close"></ElectronViteTitleBarButton>
    </section>
  </section>
</template>
<script setup>
import './electron-vite-title-bar-style.css'
import { onBeforeMount, onMounted, ref, computed } from 'vue'
import ElectronViteTitleBarButton from './ElectronViteTitleBarButton.vue'
import electronViteTitleBarMenu from './electron-vite-title-bar-menu'

// Props 설정
// icon: 타이틀바의 가장 우측에 표시할 아이콘에 대한 경로
// menu: 타이틀바에 생성할 메뉴에 대한 객체
const props = defineProps({
  icon: {
    type: String,
    required: false
  },
  title: {
    type: String,
    required: false
  },
  menu: {
    type: Array,
    required: false
  }
})

// 각 버튼에 대한 이벤트를 상위 컴포넌트에 전달하기 위한 Emit 설정
const emit = defineEmits(['onMinimize', 'onMaximize', 'onRestore', 'onClose', 'onMenuClick'])

const container = ref()
// isWindowMaximized: 윈도우가 현재 최대화 상태인지 아닌지 나타내는 값
const isWindowMaximized = ref(false)

const onMinimize = () => window.evtb.minimize()
const onMaximize = () => window.evtb.maximize()
const onRestore = () => window.evtb.restore()
const onClose = () => window.evtb.close()

onBeforeMount(() => {
  // Props에 메뉴에 대한 정보가 전달되었을 때, DOM을 생성하기 전에 데이터에 대한 유효성 검사를 수행한다.
  if (props.menu) electronViteTitleBarMenu.validateMenu(props.menu)  
})

onMounted(async () => {
  if (props.menu) {
    const menuContainer = document.querySelector('section.evtb-menu-container')
    const titleContainer = document.querySelector('section.evtb-title-container')

    electronViteTitleBarMenu.initialize(container.value, menuContainer, titleContainer, emit)
    electronViteTitleBarMenu.createRootMenu(props.menu)

    // 윈도우의 프레임이 변경되었을 때, 너비에 따라 루트 메뉴를 재생성할 수 있도록
    // 이벤트를 구성한다.
    window.addEventListener('resize', (e) => {
      electronViteTitleBarMenu.createRootMenu(props.menu)
    })
  }

  isWindowMaximized.value = await window.evtb.isMaximized()
  window.addEventListener('resize', async (e) => {
    isWindowMaximized.value = await window.evtb.isMaximized()  
  })
})
</script>
<style>
.evtb-container {
  position: relative;
  height: 30px;
  width: 100vw;
  min-width: 480px;
  border-bottom: 1px solid var(--evtb-container-border-bottom-color);
  background-color: var(--evtb-container-background-color);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  -webkit-app-region: drag;
}
section.evtb-logo-container {
  position: relative;
  padding: 3px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  -webkit-app-region: no-drag;
}
section.evtb-logo-container > img {
  position: relative;
  height: 20px;
  width: auto;
  user-select: none;
}
section.evtb-title-container {
  position: absolute;
  padding: 0 20px;
  font-size: 0.75em;
  user-select: none;
  max-width: 200px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  color: var(--evtb-title-container-text-color);
}
section.evtb-button-container {
  margin-left: auto;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
}

section.evtb-menu-container > ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  font-size: 0.75em;
}
section.evtb-menu-container > ul[level="0"] {
  height: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}
section.evtb-menu-container > ul[level="0"] > li {
  padding: 0 10px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  -webkit-app-region: no-drag;
  user-select: none;
  border-left: 1px solid var(--evtb-root-menu-item-background-color);
  border-right: 1px solid var(--evtb-root-menu-item-background-color);
  background-color: var(--evtb-root-menu-item-background-color);
  color: var(--evtb-root-menu-item-text-color);
}
section.evtb-menu-container > ul[level="0"] > li:hover {
  background-color: var(--evtb-root-menu-item-hover-background-color);
}
section.evtb-menu-container > ul[level="0"] > li:active {
  background-color: var(--evtb-root-menu-item-active-background-color);
}
section.evtb-menu-container > ul[level="0"] > li.selected {
  border-left: 1px solid var(--evtb-root-menu-item-active-background-color);
  border-right: 1px solid var(--evtb-root-menu-item-active-background-color);
  background-color: var(--evtb-root-menu-item-hover-background-color);
}
section.evtb-menu-container > ul[level="0"] > li[type="menu"] > svg {
  width: 1.8em;
  height: 1.8em;
  fill: var(--evtb-menu-item-collapse-icon-fill-color);
}
section.evtb-menu-container > ul:not([level="0"]) {
  position: absolute;
  z-index: 2;
  min-width: 200px;
  padding: 5px 0;
  -webkit-app-region: no-drag;
  border: 1px solid var(--evtb-menu-container-border-color);
  background-color: var(--evtb-menu-container-background-color);
  box-shadow: 2px 2px 5px var(--evtb-menu-container-box-shadow-color);
}
section.evtb-menu-container > ul:not([level="0"]) > li[type="menu"] {
  padding: 7px 5px 7px 10px;
  -webkit-app-region: no-drag;
  user-select: none;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 16px;
  background-color: var(--evtb-menu-item-background-color);
}
section.evtb-menu-container > ul:not([level="0"]) > li[type="menu"]:hover {
  background-color: var(--evtb-menu-item-hover-background-color);
}
section.evtb-menu-container > ul:not([level="0"]) > li[type="menu"] > svg {
  width: 1.8em;
  height: 1.8em;
  fill: var(--evtb-menu-item-expand-icon-fill-color);
}
section.evtb-menu-container > ul:not([level="0"]) > li[type="seperator"] {
  height: 1px;
  border-top: 1px solid var(--evtb-menu-item-seperator-color);
  padding: 0;
  margin: 4px 0 2.8px 0;
}
section.evtb-menu-container > ul:not([level="0"]) > li[type="menu"] > span.evtb-menu-item-label {
  padding: 7px 30px 7px 5px;
  color: var(--evtb-menu-item-text-color);
}
section.evtb-menu-container > ul:not([level="0"]) > li[type="menu"] > span.evtb-menu-item-hotkey {
  padding: 7px 5px 7px 30px;
  color: var(--evtb-menu-item-hotkey-text-color);
}
</style>