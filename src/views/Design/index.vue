<template>
  <Splitpanes class="default-theme" :style="`height: ${height}`">
    <Pane size="15" min-size="5" max-size="50" class="group-wrap">
      <Group></Group>
    </Pane>
    <Pane size="85">
      <router-view />
    </Pane>
  </Splitpanes>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import { getContextHeight } from '@/utils/index.ts'
  import { Splitpanes, Pane } from 'splitpanes'
  import 'splitpanes/dist/splitpanes.css'
  import Group from './Group.vue'

  export default defineComponent({
    components: { Splitpanes, Pane, Group },
    setup() {
      const height = computed(() => {
        return `${getContextHeight()}px`
      })
      return { height }
    }
  })
</script>
<style lang="scss" scoped>
  ::v-deep(.splitpanes__splitter) {
    background-color: $--color-lineWeight-split !important;
  }
  .group-wrap {
    background-color: $--color-bg-enabled !important;
    padding-top: 13px;
    padding-right: 15px;
  }
</style>
