<template>
  <Splitpanes class="default-theme" :style="`height: ${editAreaHeight}`">
    <Pane size="75">
      <div class="tbar">
        <el-button icon="el-icon-goods">保存</el-button>
        <el-button icon="el-icon-eleme">预览</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button icon="el-icon-edit"></el-button>
        <el-button icon="el-icon-share"></el-button>
        <el-button icon="el-icon-delete"></el-button>
      </div>
      <el-row>
        <el-col :span="4">
          <el-input v-model="formulaName" readonly class="cell-name" />
        </el-col>
        <el-col :span="20">
          <el-input v-model="formulaData" />
        </el-col>
      </el-row>
      <el-table
        :data="status.data"
        border
        :height="tableHeight"
        :style="cssVars"
        style="background-color: #ccc; border-top: 0"
        :header-cell-style="headerCellStyle"
        :row-style="rowStyle"
      >
        <el-table-column type="index" fixed style="background-color: rgb(25, 137, 250, 0.2)"></el-table-column>
        <!-- v-for="c in cols" c 从 1 开始 -->
        <el-table-column v-for="c in status.cols" :key="c" :label="num2col(c)" :prop="num2col(c)" width="100">
          <template #default="{ row, column, $index }">
            <el-input
              v-model="row[column.property]"
              :class="getCellClass(c, $index + 1)"
              @input="setCurrentCell(c, $index + 1)"
              @focus="setCurrentCell(c, $index + 1)"
              @dragover="$event.preventDefault()"
              @dragenter="$event.target.style.borderColor = cellBorderColor"
              @dragleave="$event.target.style.borderColor = ''"
              @drop="drop($event, row, column.property, c, $index)"
            ></el-input>
          </template>
        </el-table-column>
      </el-table>
      <ReportBottom ref="refBottom" :style="`height: ${bottomAreaHeight}px`" @changeTypeDirec="handleBottomChange">
        <p>{{ status.data }} </p>
      </ReportBottom>
    </Pane>
    <Pane>
      <ReportRight></ReportRight>
    </Pane>
  </Splitpanes>
</template>
<script lang="ts">
import { defineComponent, reactive, computed, onMounted, watch, ref } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { num2col, getContextHeight } from '@/utils/index.ts'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import ReportBottom from './Bottom/index.vue'
import ReportRight from './Right/index.vue'
import reportControl, { RowData } from './report.ts'
import { reportApi } from '@/api/modules/report'
import formulaHook from './Bottom/formula'

export default defineComponent({
  components: { ReportBottom, ReportRight, Splitpanes, Pane },
  setup() {
    const store = useStore()
    const route = useRoute()

    const refBottom = ref()

    // 计算各个区域高度
    const bottomAreaHeight = 170
    const editAreaHeight = computed(() => {
      return `${getContextHeight()}px`
    })
    const tableHeight = computed(() => {
      return `${getContextHeight() - bottomAreaHeight}px`
    })

    const {
      cssVars,
      currentCell,
      getCellClass,
      headerCellStyle,
      rowStyle,
      setCurrentCell,
      drop,
      initControl
    } = reportControl()

    // 初始table的行数列数
    const status = reactive<{
      data: RowData[]
      cols: number
      rows: number
    }>({
      data: [],
      cols: 10,
      rows: 6
    })

    const formulaName = computed(() =>
      currentCell.rowIndex !== -1 && currentCell.colIndex !== -1
        ? `${num2col(currentCell.colIndex)}${currentCell.rowIndex}`
        : ''
    )
    const formulaData = computed({
      get: () => {
        if (currentCell.rowIndex === -1 || currentCell.colIndex === -1) {
          return ''
        } else {
          return status.data[currentCell.rowIndex - 1][num2col(currentCell.colIndex)]
        }
      },
      set: val => {
        status.data[currentCell.rowIndex - 1][num2col(currentCell.colIndex)] = val
      }
    })

    watch(formulaData, newVal => {
      refBottom.value.parseFormula(newVal)
    })

    const initTable = () => {
      // 清空变量
      status.data = []
      status.cols = 10
      status.rows = 6

      // 初始化空表格
      for (let r = 1; r <= status.rows; r++) {
        const rowData: RowData = {}
        for (let c = 1; c <= status.cols; c++) {
          rowData[num2col(c)] = ''
        }
        status.data.push(rowData)
      }

      //初始化控制类
      initControl()
    }

    // 获取报表
    onMounted(() => {
      initTable()
      getReport(route.params.id)
    })
    onBeforeRouteUpdate(to => {
      initTable()
      getReport(to.params.id)
    })

    const getReport = reportId => {
      reportApi.getReport(reportId).then(resp => {
        store.dispatch('report/setCurrent', resp.data)
      })
    }

    const formula = formulaHook()
    const handleBottomChange = formulaTypeDir => {
      if (currentCell.rowIndex !== -1 && currentCell.colIndex !== -1) {
        const originData = formula.getOriginData(status.data[currentCell.rowIndex - 1][num2col(currentCell.colIndex)])
        status.data[currentCell.rowIndex - 1][num2col(currentCell.colIndex)] = formula.getFormulaData(
          originData,
          formulaTypeDir.type,
          formulaTypeDir.direction
        )
      }
    }

    return {
      refBottom,
      num2col,
      editAreaHeight,
      tableHeight,
      bottomAreaHeight,
      status,
      formulaName,
      formulaData,

      cssVars,
      currentCell,
      getCellClass,
      headerCellStyle,
      rowStyle,
      setCurrentCell,
      drop,

      handleBottomChange
    }
  }
})
</script>

<style lang="scss" scoped>
.tbar {
  padding: 6px;
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
}
::v-deep(.cell-name input) {
  text-align: center;
}
::v-deep(.el-table__header th:not(:first-child)) {
  text-align: center;
  cursor: s-resize;
}
::v-deep(.el-table__header th:first-child) {
  cursor: se-resize;
}
::v-deep(.el-table__body tr.hover-row > td) {
  background-color: transparent;
}
::v-deep(.el-table__body .cell) {
  padding: 0 !important;
}
::v-deep(.el-table__body td) {
  padding: 0 !important;
}
::v-deep(.el-table__body tr > td:nth-child(1)) {
  text-align: center;
  cursor: e-resize;
}
::v-deep(.el-table__body td) {
  text-align: center;
}

::v-deep(.el-input__inner) {
  border-radius: 0;
}
::v-deep(.el-table__body .el-input__inner) {
  cursor: cell;
}
::v-deep(.el-table__body .cell-blur .el-input__inner) {
  border-color: transparent;
}
::v-deep(.el-table__body .cell-focus .el-input__inner) {
  border-color: var(--cellBorderColor);
}
</style>
