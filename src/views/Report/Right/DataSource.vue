<template>
  <Splitpanes class="default-theme" horizontal @resize="computedListHeight($event[0].size)">
    <Pane size="50" min-size="5" max-size="75" style="padding: 15px">
      <div v-if="state.selected" class="select-list-wrap" :style="`height: ${state.selectListHeight}px`">
        {{ state.selected.name }}
        <ul class="field-list">
          <li
            v-for="(field, idx) in state.selected.fields"
            :key="`f-${idx}`"
            draggable="true"
            @dragstart="dragStart($event, field)"
          >
            <SvgIcon icon-class="alziduan" style="margin-right: 5px" /> {{ field.fieldKey }}
          </li>
        </ul>
        <div>参数: </div>
        <ul class="params-list">
          <li v-for="(param, idx) in state.selected.params" :key="`p-${idx}`">
            <SvgIcon icon-class="alcanshu" style="margin-right: 5px" /> {{ param.paramsName }}
          </li>
        </ul>
      </div>
    </Pane>
    <Pane size="50" min-size="5" max-size="75">
      <el-input
        v-model="state.searchText"
        class="input-search"
        placeholder="搜索数据源..."
        prefix-icon="el-icon-search"
      ></el-input>
      <el-menu v-loading="state.listLoading" class="ds-list-wrap" :style="`height: ${state.unSelectListHeight}px`">
        <el-submenu v-for="g in unSelectedList" :key="g.groupId" :index="g.groupId">
          <template #title>
            <div>
              <i v-if="!state.groupOpen[g.groupId]" class="el-icon-folder"></i>
              <i v-else class="el-icon-folder-opened group-opened"></i>
              <span>{{ g.groupName }}</span>
            </div>
          </template>
          <el-menu-item
            v-for="child in g.dataSources"
            :key="`${child.dataSourceId}`"
            :index="`${child.dataSourceId}`"
            class="ds-list"
          >
            <i class="el-icon-document"></i>
            {{ child.name }}
            <el-button
              class="select-ds"
              type="text"
              size="mini"
              :disabled="state.selected && state.selected.dataSourceId === child.dataSourceId"
              @click="handleSelect(child)"
            >
              选择
            </el-button>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </Pane>
  </Splitpanes>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { DataSource } from '@/store/type'
import { getContextHeight, cloneObject } from '@/utils/index'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { dsApi } from '@/api/modules/ds'
import { reportApi } from '@/api/modules/report'

export default defineComponent({
  components: { Splitpanes, Pane },
  setup() {
    const store = useStore()

    const state = reactive<{
      searchText: string
      groupOpen: { [key: string]: boolean }
      selected: DataSource
      selectListHeight: number
      unSelectListHeight: number
      listLoading: boolean
    }>({
      searchText: '',
      groupOpen: {},
      selected: undefined,
      selectListHeight: 300,
      unSelectListHeight: 300,
      listLoading: false
    })

    const unSelectedList = computed(() => {
      const list = cloneObject(store.state.dataSourceGroup.list)
      const filterList = list.filter(item => {
        const length = item.dataSources.length
        if (length === 0) {
          return false
        } else {
          if (state.searchText === '') {
            return true
          } else {
            const children = item.dataSources.filter(child => {
              return child.name.indexOf(state.searchText) >= 0
            })
            if (children.length > 0) {
              item.dataSources = children
              return true
            } else {
              return false
            }
          }
        }
      })
      return filterList
    })

    const computedListHeight = size => {
      const height = getContextHeight() - 46 - 35 //报表名字高度46, tabName35
      state.selectListHeight = (height * size) / 100
      state.unSelectListHeight = height - state.selectListHeight - 7 - 32 //分割线高度7 搜索框高度32
    }

    onMounted(() => {
      computedListHeight(50)
      getUnSelectList()
    })

    watch(
      () => store.state.report.current,
      (newVal, oldVal) => {
        if (oldVal === undefined || oldVal.reportId !== newVal.reportId) {
          // 如果在onMounted中执行, 不能即时获得store.state.report.current
          getSelectList(newVal.reportId)
        }
      }
    )

    const getUnSelectList = () => {
      if (store.state.dataSourceGroup.size === 0) {
        state.listLoading = true
        dsApi.getGroups().then(resp => {
          state.listLoading = false
          if (resp.success) {
            store.dispatch('dataSourceGroup/setList', resp.data)
          }
        })
      }
    }

    const getSelectList = reportId => {
      reportApi.getReportDs(reportId).then(resp => {
        if (resp.success) {
          state.selected = resp.data
        }
      })
    }

    const handleSelect = (ds: DataSource) => {
      state.listLoading = true
      reportApi.updateReportDs(store.state.report.current.reportId, ds.dataSourceId).then(resp => {
        state.listLoading = false
        if (resp.success) {
          state.selected = resp.data
        }
      })
    }

    const dragStart = (e, field) => {
      e.dataTransfer.setData('field', JSON.stringify(field))
    }

    return { state, unSelectedList, handleSelect, computedListHeight, dragStart }
  }
})
</script>

<style lang="scss" scoped>
.splitpanes__pane {
  background-color: $--color-bg-enabled !important;
}

.field-list,
.params-list {
  @extend .list-unstyled;
  margin-top: 2px;
  li {
    padding: 2px 15px;
    cursor: pointer;
  }
}

.ds-list-wrap,
.select-list-wrap {
  overflow-y: auto;
}
.select-ds {
  display: none;
  float: right;
}
.ds-list:hover {
  .select-ds {
    display: inline-block;
  }
}
::v-deep(.el-menu-item) {
  height: 28px !important;
  line-height: 28px !important;
  color: $--color-text-base;
  &.is-active {
    color: $--color-text-link;
  }
}
::v-deep(.el-submenu__title) {
  height: 30px !important;
  line-height: 30px !important;
  color: $--color-text-base;
}
</style>
