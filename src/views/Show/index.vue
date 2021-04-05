<template>
  <div class="tbar">
    <el-row>
      <el-col :span="12">
        <el-button icon="el-icon-download" @click="handleExport">导出</el-button>
        <el-button icon="el-icon-refresh">刷新</el-button>
      </el-col>
      <el-col :span="12" class="pagination">
        <span class="total-page">共 {{ state.totalPage }} 页</span>
        <el-button-group>
          <el-button icon="el-icon-d-arrow-left"></el-button>
          <el-button icon="el-icon-arrow-left"></el-button>
        </el-button-group>
        <el-input v-model="state.pageNum" class="page-input"></el-input>
        <el-button-group>
          <el-button icon="el-icon-arrow-right"></el-button>
          <el-button icon="el-icon-d-arrow-right"></el-button>
        </el-button-group>
      </el-col>
    </el-row>
  </div>
  <div class="table-wrap">
    <table v-if="state.table.tbody">
      <tbody>
        <tr v-for="tr in state.table.tbody.trs" :key="tr">
          <td v-for="td in tr.tds" :key="td" width="20%">
            {{ td.content }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { reportApi } from '@/api/modules/report'

export default defineComponent({
  setup() {
    const route = useRoute()

    const state = reactive<{
      table: any
      pageNum: number
      totalPage: number
    }>({
      table: {},
      pageNum: 1,
      totalPage: 1
    })

    // 获取报表
    onMounted(() => {
      getReport(route.params.id)
    })
    onBeforeRouteUpdate(to => {
      getReport(to.params.id)
    })

    const getReport = reportId => {
      reportApi.show(reportId).then(resp => {
        if (resp.success) {
          state.table = resp.data
        }
      })
    }

    const handleExport = () => {
      console.log('handleExport')
    }

    return { state, handleExport }
  }
})
</script>

<style lang="scss" scoped>
.tbar {
  background-color: $--color-bg-empty;
  border-bottom: 1px solid $--color-line-split;
  padding: 6px 15px;
  button {
    font-size: $--size-font-base;
    border: 1px solid transparent;
    background-color: transparent;
    &:hover,
    &:focus {
      border: 1px solid $--color-bg-link;
    }
    i {
      font-size: $--size-font-larger !important;
    }
  }
  .pagination {
    text-align: right;
    .total-page {
      margin-right: 15px;
      color: $--color-text-secondary;
    }
    ::v-deep(.page-input) {
      display: inline-block;
      width: 45px;
      input.el-input__inner {
        padding: 0 !important;
        text-align: center !important;
      }
    }
  }
}
.table-wrap {
  padding: 15px;
  text-align: center;
}
</style>
