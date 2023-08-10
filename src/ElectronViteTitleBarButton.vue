<template>
  <button ref="button" class="evtb-button" :class="{ close: props.role == 'close' }">
    <svg ref="buttonSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" :style="{ width: iconWidth + 'px', height: iconHeight + 'px' }">
      <path :d="iconPath"/>
    </svg>
  </button>
</template>
<script setup>
import { computed, onMounted, onBeforeMount, ref } from 'vue'

const button = ref()
const buttonSvg = ref()
const props = defineProps({
  role: {
    type: String,
    required: true
  }
})

const svgPath = {
  minimize: 'M240-464.615v-30.77h480v30.77H240Z',
  maximize: 'M160-160v-640h640v640H160Zm30.769-30.769h578.462v-578.462H190.769v578.462Zm0 0v-578.462 578.462Z',
  restore: 'M273.846-390.769V-360h-98.462q-22.442 0-38.913-16.471Q120-392.942 120-415.384v-369.232q0-22.442 16.471-38.913Q152.942-840 175.384-840h369.232q22.442 0 38.913 16.471Q600-807.058 600-784.616v98.462h-30.769v-98.462q0-10.769-6.923-17.692t-17.692-6.923H175.384q-10.769 0-17.692 6.923t-6.923 17.692v369.232q0 10.769 6.923 17.692t17.692 6.923h98.462ZM415.384-120q-22.442 0-38.913-16.471Q360-152.942 360-175.384v-369.232q0-22.442 16.471-38.913Q392.942-600 415.384-600h369.232q22.442 0 38.913 16.471Q840-567.058 840-544.616v369.232q0 22.442-16.471 38.913Q807.058-120 784.616-120H415.384Zm0-30.769h369.232q10.769 0 17.692-6.923t6.923-17.692v-369.232q0-10.769-6.923-17.692t-17.692-6.923H415.384q-10.769 0-17.692 6.923t-6.923 17.692v369.232q0 10.769 6.923 17.692t17.692 6.923ZM600-360Z',
  close: 'm252.846-230.846-22-22L458-480 230.846-707.154l22-22L480-502l227.154-227.154 22 22L502-480l227.154 227.154-22 22L480-458 252.846-230.846Z'
}

const iconPath = computed(() => {
  return svgPath[props.role]
})

const iconWidth = ref()
const iconHeight = ref()

onBeforeMount(() => {
  const roles = ['minimize', 'maximize', 'restore', 'close']
  if (!roles.includes(props.role)) {
    throw TypeError('role only has minimize, maximize, restore, close')
  }

  if (props.role == 'maximize') {
    iconWidth.value = 16
    iconHeight.value = 17
  } else if (props.role == 'restore') {
    iconWidth.value = 16
    iconHeight.value = 18
  } else {
    iconWidth.value = 21
    iconHeight.value = 21
  }
})

onMounted(() => {
  button.value.addEventListener('mouseover', (e) => {
    if (!button.value.classList.contains('hover')) {
      button.value.classList.add('hover')
    }
  })
  button.value.addEventListener('mouseleave', (e) => {
    if (button.value.classList.contains('hover')) {
      button.value.classList.remove('hover')
    }
  })
  button.value.addEventListener('mousedown', (e) => {
    button.value.classList.add('active')
  })
  button.value.addEventListener('mouseup', (e) => {
    if (button.value.classList.contains('active')) {
      button.value.classList.remove('active')
    }
    if (button.value.classList.contains('hover')) {
      button.value.classList.remove('hover')
    }
  })
  document.addEventListener('mouseup', (e) => {
    if (e.target != button.value && e.target != buttonSvg.value) {
      if (button.value.classList.contains('active')) {
        button.value.classList.remove('active')
      }
      if (button.value.classList.contains('hover')) {
        button.value.classList.remove('hover')
      }
    }
  })
})
</script>
<style>
button.evtb-button {
  border: 0;
  padding: 0 5px;
  height: 30px;
  width: 48px;
  background-color: var(--evtb-menu-button-background-color);
  display: flex;
  justify-content: center;
  align-items: center;
  -webkit-app-region: no-drag;
  outline: 0;
}
button.evtb-button > svg {
  width: 1.2em;
  height: 1.2em;
  user-select: none;
  fill: var(--evtb-menu-button-icon-color);
}
button.evtb-button.hover {
  background-color: var(--evtb-menu-button-hover-background-color);
}
button.evtb-button.hover > svg {
  fill: var(--evtb-menu-button-hover-icon-color);
}
button.evtb-button.hover.close {
  background-color: var(--evtb-menu-button-close-hover-background-color);
}
button.evtb-button.hover.close > svg {
  fill: var(--evtb-menu-button-close-hover-icon-color);
}
button.evtb-button.active {
  background-color: var(--evtb-menu-button-active-background-color);
}
button.evtb-button.active > svg {
  fill: var(--evtb-menu-button-active-icon-color);
}
button.evtb-button.active.close {
  background-color: var(--evtb-menu-button-close-active-background-color);
}
button.evtb-button.active.close > svg {
  fill: var(--evtb-menu-button-close-active-icon-color);
}
</style>