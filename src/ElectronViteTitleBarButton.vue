<template>
  <button ref="button" class="evtb-button" :class="{ close: props.role == 'close' }">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" :style="iconStyles">
      <path :d="iconPath"/>
    </svg>
  </button>
</template>
<script setup>
import { computed, onMounted, onBeforeMount, ref } from 'vue'

// 버튼에 대한 객체
const button = ref()
// 버튼 클릭에 대한 이벤트를 Emit할 수 있도록 객체를 생성한다.
const emit = defineEmits(['click'])
// 버튼에 대한 역할(최소화, 최대화, 닫기 등)을 Props로 전달받는다.
const props = defineProps({
  role: {
    type: String,
    required: true
  }
})
// 각 Role에 해당하는 SVG Path 값
const svgPath = {
  minimize: 'M240-464.615v-30.77h480v30.77H240Z',
  maximize: 'M160-160v-640h640v640H160Zm30.769-30.769h578.462v-578.462H190.769v578.462Zm0 0v-578.462 578.462Z',
  restore: 'M273.846-390.769V-360h-98.462q-22.442 0-38.913-16.471Q120-392.942 120-415.384v-369.232q0-22.442 16.471-38.913Q152.942-840 175.384-840h369.232q22.442 0 38.913 16.471Q600-807.058 600-784.616v98.462h-30.769v-98.462q0-10.769-6.923-17.692t-17.692-6.923H175.384q-10.769 0-17.692 6.923t-6.923 17.692v369.232q0 10.769 6.923 17.692t17.692 6.923h98.462ZM415.384-120q-22.442 0-38.913-16.471Q360-152.942 360-175.384v-369.232q0-22.442 16.471-38.913Q392.942-600 415.384-600h369.232q22.442 0 38.913 16.471Q840-567.058 840-544.616v369.232q0 22.442-16.471 38.913Q807.058-120 784.616-120H415.384Zm0-30.769h369.232q10.769 0 17.692-6.923t6.923-17.692v-369.232q0-10.769-6.923-17.692t-17.692-6.923H415.384q-10.769 0-17.692 6.923t-6.923 17.692v369.232q0 10.769 6.923 17.692t17.692 6.923ZM600-360Z',
  close: 'm252.846-230.846-22-22L458-480 230.846-707.154l22-22L480-502l227.154-227.154 22 22L502-480l227.154 227.154-22 22L480-458 252.846-230.846Z'
}
// 버튼의 Role에 해당하는 SVG Path 값을 계산하여 반환한다.
const iconPath = computed(() => {
  return svgPath[props.role]
})
// 버튼 Role에 따른 인라인스타일을 계산하여 반환한다.
const iconStyles = computed(() => {
  let width, height
  if (props.role == 'maximize') {
    width = '16px'
    height = '17px'
  } else if (props.role == 'restore') {
    width = '16px'
    height = '18px'
  } else {
    width = '21px'
    height = '21px'
  }
  return {
    width: width,
    height: height
  }
})

// Props 객체에 대한 유효성 검사를 수행한다.
onBeforeMount(() => {
  const roles = ['minimize', 'maximize', 'restore', 'close']
  if (!roles.includes(props.role)) {
    throw TypeError('role은 minimize, maximize, restore, close 값을 가질 수 있습니다.')
  }
})

// 버튼에 대한 Click, Mouseover 이벤트를 바인드한다.
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
    emit('click', button.value)
  })
})
</script>
<style scoped>
button {
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
button > svg {
  width: 1.2em;
  height: 1.2em;
  user-select: none;
  fill: var(--evtb-menu-button-icon-color);
}
button.hover {
  background-color: var(--evtb-menu-button-hover-background-color);
}
button.hover > svg {
  fill: var(--evtb-menu-button-hover-icon-color);
}
button.hover.close {
  background-color: var(--evtb-menu-button-close-hover-background-color);
}
button.hover.close > svg {
  fill: var(--evtb-menu-button-close-hover-icon-color);
}
button.active {
  background-color: var(--evtb-menu-button-active-background-color);
}
button.active > svg {
  fill: var(--evtb-menu-button-active-icon-color);
}
button.active.close {
  background-color: var(--evtb-menu-button-close-active-background-color);
}
button.active.close > svg {
  fill: var(--evtb-menu-button-close-active-icon-color);
}
</style>