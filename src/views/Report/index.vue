<template>
  <Splitpanes class="default-theme" :style="`height: ${height}`">
    <Pane size="15" min-size="5" max-size="50">
      <div class="group-wrap" :style="`height: ${height}`">
        <Group ref="refGroup" group-type="reportGroup"></Group>
      </div>
    </Pane>
    <Pane size="85">
      <router-view />
    </Pane>
  </Splitpanes>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { getContextHeight } from '@/utils/index.ts'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import Group from '@/components/Group/index.vue'
import { reportApi } from '@/api/modules/report'

export default defineComponent({
  components: { Splitpanes, Pane, Group },
  setup() {
    const store = useStore()

    const height = computed(() => {
      return `${getContextHeight()}px`
    })

    onMounted(() => {
      reportApi.getGroups().then(resp => {
        store.dispatch('reportGroup/setList', resp.data)
      })
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
  background-color: $--color-bg-enabled;
  padding-top: 13px;
  padding-left: 35px;
  padding-right: 15px;
}
</style>
