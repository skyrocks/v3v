<template>
  <div class="name">
    {{ reportName }}
    <span class="edit" @click="handleEditName"><i class="el-icon-edit"></i></span>
  </div>
  <div class="split">
    <div class="line"></div>
  </div>
  <el-tabs v-model="state.activeCard" tab-position="bottom" type="card" class="tab">
    <el-tab-pane label="数据" class="pane" :style="`height: ${paneHeight}`">
      <DS></DS>
    </el-tab-pane>
    <el-tab-pane label="格" class="pane" :style="`height: ${paneHeight}`">单元格属性</el-tab-pane>
    <el-tab-pane label="行" class="pane" :style="`height: ${paneHeight}`">行属性</el-tab-pane>
    <el-tab-pane label="列" class="pane" :style="`height: ${paneHeight}`">列属性</el-tab-pane>
    <el-tab-pane label="表" class="pane" :style="`height: ${paneHeight}`">报表属性</el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from 'vue'
import { getContextHeight } from '@/utils/index'
import { useStore } from 'vuex'
import DS from './DataSource.vue'
import { ElMessageBox } from 'element-plus'
import { reportApi } from '@/api/modules/report'

export default defineComponent({
  components: { DS },
  setup() {
    const store = useStore()

    const paneHeight = computed(() => {
      return `${getContextHeight() - 35 - 47}px`
    })
    const state = reactive<{ activeCard: string }>({ activeCard: '0' })

    const reportName = computed(() => {
      if (store.state.report.current) {
        return store.state.report.current.reportName
      } else {
        return ''
      }
    })

    const handleEditName = () => {
      ElMessageBox.prompt('', '修改报表名称', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        inputPattern: /^.+$/,
        inputErrorMessage: '报表名称不能为空'
      })
        .then(({ value }) => {
          const data = { reportId: store.state.report.current.reportId, reportName: value }
          reportApi.updateReportName(data).then(resp => {
            if (resp.success) {
              store.state.report.current.reportName = value
            } else {
              ElMessage.error(resp.message)
            }
          })
        })
        .catch(() => {})
    }

    return { paneHeight, state, reportName, handleEditName }
  }
})
</script>

<style lang="scss" scoped>
.name {
  background-color: $--color-bg-enabled;
  padding: 0 15px;
  height: 46px;
  line-height: 46px;
  box-sizing: border-box;
  font-size: $--size-font-larger;
  font-weight: bold;
  .edit {
    margin-left: 10px;
    cursor: pointer;
  }
}
.split {
  background-color: $--color-bg-enabled;
  .line {
    margin: 0 15px;
    height: 1px;
    background-color: $--color-line-split;
  }
}

.pane {
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
::v-deep(.el-tabs__nav) {
  border: 0 !important;
  float: left;
}
</style>
