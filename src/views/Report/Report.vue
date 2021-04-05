<template>
  <Splitpanes class="default-theme" :style="`height: ${editAreaHeight}`">
    <Pane size="75">
      <div class="tbar">
        <el-button-group>
          <el-button icon="el-icon-goods" @click="handleSave">保存</el-button>
          <el-button icon="el-icon-eleme">预览</el-button>
        </el-button-group>
        <el-divider direction="vertical"></el-divider>
        <el-select v-model="status.font" style="width: 85px" size="mini">
          <el-option label="宋体" value="宋体"></el-option>
        </el-select>
        <el-select v-model="status.fontSize" style="width: 65px" size="mini">
          <el-option label="12" value="12"></el-option>
        </el-select>
        <el-divider direction="vertical"></el-divider>
        <el-button-group>
          <el-button>
            <SvgIcon icon-class="alcuti" />
          </el-button>
          <el-button>
            <SvgIcon icon-class="alitalic" />
          </el-button>
          <el-button>
            <SvgIcon icon-class="alxiahuaxian" />
          </el-button>
        </el-button-group>
        <el-divider direction="vertical"></el-divider>
        <el-dropdown>
          <el-button>
            <SvgIcon icon-class="alborder-none" />
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item><SvgIcon icon-class="alborder-all" /></el-dropdown-item>
              <el-dropdown-item><SvgIcon icon-class="alborder-top" /></el-dropdown-item>
              <el-dropdown-item><SvgIcon icon-class="alborder-right" /></el-dropdown-item>
              <el-dropdown-item><SvgIcon icon-class="alborder-bottom" /></el-dropdown-item>
              <el-dropdown-item><SvgIcon icon-class="alborder-left" /></el-dropdown-item>
              <el-dropdown-item><SvgIcon icon-class="alborder-none" /></el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-divider direction="vertical"></el-divider>
        <el-button-group>
          <div class="fill-color">
            <el-color-picker
              v-model="status.fillColor"
              size="mini"
              :predefine="status.predefineColors"
            ></el-color-picker>
          </div>
          <div class="font-color">
            <el-color-picker
              v-model="status.fontColor"
              size="mini"
              :predefine="status.predefineColors"
            ></el-color-picker>
          </div>
        </el-button-group>
        <el-divider direction="vertical"></el-divider>
        <el-button-group>
          <el-button>
            <SvgIcon icon-class="aljuzuo" />
          </el-button>
          <el-button>
            <SvgIcon icon-class="aljuzhong" />
          </el-button>
          <el-button>
            <SvgIcon icon-class="aljuyou" />
          </el-button>
        </el-button-group>
        <el-divider direction="vertical"></el-divider>
        <el-button-group>
          <el-button>
            <SvgIcon icon-class="alhebingcell" />
          </el-button>
        </el-button-group>
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
      <p>{{ status.data }} </p>
      <ReportBottom ref="refBottom" :style="`height: ${bottomAreaHeight}px`" @changeTypeDirec="handleBottomChange">
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
import { ElMessage } from 'element-plus'

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
      font: string
      fontSize: string
      fontColor: ''
      fillColor: ''
      predefineColors: any[]

      reportId: string
      data: RowData[]
      cols: number
      rows: number
    }>({
      font: '宋体',
      fontSize: '12',
      fontColor: '#606266',
      fillColor: '#ffffff',
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsv(51, 100, 98)',
        'hsva(120, 40, 94, 0.5)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
        '#c7158577'
      ],

      reportId: '',
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

    const initTable = (cols = 10, rows = 6, body = {}) => {
      // 清空变量
      status.data = []
      status.cols = cols
      status.rows = rows

      // 初始化空表格
      for (let r = 1; r <= status.rows; r++) {
        const rowData: RowData = {}
        for (let c = 1; c <= status.cols; c++) {
          const colLetter = num2col(c)
          const key = `${colLetter}${r}`
          if (body[key]) {
            rowData[colLetter] = body[key]
          } else {
            rowData[colLetter] = ''
          }
        }
        status.data.push(rowData)
      }
    }

    // 获取报表
    onMounted(() => {
      status.reportId = route.params.id
      getReport(route.params.id)
    })
    onBeforeRouteUpdate(to => {
      status.reportId = to.params.id
      getReport(to.params.id)
    })

    const getReport = reportId => {
      reportApi.getReport(reportId).then(resp => {
        store.dispatch('report/setCurrent', resp.data)
        parseContent(resp.data.content)
      })
    }

    const parseContent = content => {
      if (content) {
        const table = JSON.parse(content)
        initTable(table.table.colNum, table.table.rowNum, table.body)
      } else {
        initTable()
      }
      //初始化控制类
      initControl()
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

    const handleSave = () => {
      const data = { condition: {}, table: { colNum: status.cols, rowNum: status.rows }, body: {} }
      status.data.forEach((row, index) => {
        for (const col in row) {
          if (row[col] != '') {
            const key = `${col}${index + 1}`
            data.body[key] = row[col]
          }
        }
      })
      reportApi.saveReportBody(status.reportId, JSON.stringify(data)).then(resp => {
        if (resp.success) {
          ElMessage.success({
            message: '报表已经保存',
            type: 'success'
          })
        } else {
          ElMessage.error(resp.message)
        }
      })
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

      handleBottomChange,

      handleSave
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
  .fill-color {
    display: inline-block;
    margin-right: 2px;
    ::v-deep(.el-color-picker__trigger) {
      .el-color-picker__icon::before {
        content: '填';
        color: $--color-text-base;
      }
    }
  }
  .font-color {
    display: inline-block;
    ::v-deep(.el-color-picker__trigger) {
      .el-color-picker__icon::before {
        content: '字';
      }
    }
  }
  ::v-deep(.el-color-picker__trigger) {
    border: 0;
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
