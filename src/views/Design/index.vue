<template>
  <Splitpanes class="default-theme" :style="`height: ${height}`">
    <Pane size="15" min-size="5" max-size="50" class="left">
      <el-tabs tab-position="bottom" type="card" class="tab">
        <el-tab-pane label="报表" class="pane group-wrap" :style="`height: ${paneHeight}`">
          <Group></Group>
        </el-tab-pane>
        <el-tab-pane label="数据源" class="pane" :style="`height: ${paneHeight}`">
          <DataSource></DataSource>
        </el-tab-pane>
      </el-tabs>
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
import DataSource from './DataSource.vue'

export default defineComponent({
  components: { Splitpanes, Pane, Group, DataSource },
  setup() {
    const height = computed(() => {
      return `${getContextHeight()}px`
    })

    const paneHeight = computed(() => {
      return `${getContextHeight() - 35}px`
    })

    return { height, paneHeight }
  }
})
</script>
<style lang="scss" scoped>
::v-deep(.splitpanes__splitter) {
  background-color: $--color-lineWeight-split !important;
}
.group-wrap {
  padding-top: 13px;
  padding-right: 15px;
}

.pane {
  background-color: $--color-bg-enabled;
  padding-left: 35px;
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
