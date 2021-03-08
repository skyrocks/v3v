<template>
  <div @contextmenu.prevent="handleContextmenu($event)">
    <slot></slot>
  </div>
  <Teleport to="#app">
    <el-card v-show="state.visible" class="context-menu" :style="{ left: state.left + 'px', top: state.top + 'px' }">
      <ul class="content-menu-list">
        <slot name="menu"></slot>
      </ul>
    </el-card>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent, watch, reactive } from 'vue'

export default defineComponent({
  setup() {
    const state = reactive<{
      visible: boolean
      top: number
      left: number
    }>({ visible: false, top: 0, left: 0 })

    watch(
      () => state.visible,
      newVal => {
        if (newVal) {
          document.body.addEventListener('click', () => (state.visible = false))
        } else {
          document.body.removeEventListener('click', () => (state.visible = false))
        }
      }
    )

    const handleContextmenu = event => {
      state.left = event.pageX
      state.top = event.pageY
      state.visible = true
    }

    return { state, handleContextmenu }
  }
})
</script>

<style lang="scss" scoped>
.context-menu {
  z-index: 9000;
  position: absolute;
}
::v-deep(.el-card__body) {
  padding: 0;
}
ul.content-menu-list {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
::v-global(ul.content-menu-list > li) {
  cursor: pointer;
  min-width: 150px;
  padding: 5px 15px;
}
::v-global(ul.content-menu-list > li:hover) {
  background-color: $--color-bg-hover;
}
</style>
