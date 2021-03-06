<template>
  <Splitpanes class="default-theme" :style="`height: ${height}`">
    <Pane size="15" min-size="5" max-size="50" class="left">
      <el-tabs v-model="state.tab" tab-position="bottom" type="card" class="tab">
        <el-tab-pane label="数据源" name="ds" class="pane1" :style="`height: ${paneHeight}`">
          <DataSource></DataSource>
        </el-tab-pane>
        <el-tab-pane label="数据服务" name="db" class="pane2" :style="`height: ${paneHeight}`">
          <Database></Database>
        </el-tab-pane>
      </el-tabs>
    </Pane>
    <Pane size="85">
      <router-view />
    </Pane>
  </Splitpanes>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, onMounted } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { getContextHeight } from '@/utils/index.ts'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import DataSource from './DataSource/List.vue'
import Database from './Database/List.vue'

export default defineComponent({
  components: { Splitpanes, Pane, DataSource, Database },
  setup() {
    const route = useRoute()

    const state = reactive<{
      tab: string
    }>({ tab: 'ds' })

    const height = computed(() => {
      return `${getContextHeight()}px`
    })

    const paneHeight = computed(() => {
      return `${getContextHeight() - 35}px`
    })

    onMounted(() => {
      setTab(route.path)
    })

    onBeforeRouteUpdate(to => {
      setTab(to.path)
    })

    const setTab = path => {
      if (path.indexOf('/db') === 0) {
        state.tab = 'db'
      }
      if (path.indexOf('/ds') === 0) {
        state.tab = 'ds'
      }
    }

    return { state, height, paneHeight }
  }
})
</script>
<style lang="scss" scoped>
::v-deep(.splitpanes__splitter) {
  background-color: $--color-lineWeight-split !important;
}

.pane1 {
  background-color: $--color-bg-enabled;
  padding: 13px 15px 13px 35px;
}
.pane2 {
  background-color: $--color-bg-enabled;
}
::v-deep(.el-tabs__item) {
  color: $--color-text-base;
  font-size: $--size-font-base;
  font-size: 1.4rem;
  height: 35px !important;
  line-height: 35px;

  &.is-active {
    color: $--color-text-link;
    background-color: $--color-bg-enabled;
  }
}
::v-deep(.el-tabs__header) {
  margin-top: 0 !important;
}
::v-deep(.left .el-tabs__nav) {
  border: 0 !important;
  float: right;
}
</style>
