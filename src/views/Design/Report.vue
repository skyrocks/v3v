<template>
  <el-row>
    <el-col :span="4">
      <el-input v-model="currentCellName" readonly class="cell-name" />
    </el-col>
    <el-col :span="20">
      <el-input v-model="currentCellData" @input="cellInput" />
    </el-col>
  </el-row>
  <el-table
    :data="inputData"
    border
    :height="600"
    :style="cssVars"
    :header-cell-style="headerCellStyle"
    :row-style="rowStyle"
  >
    <el-table-column type="index" fixed style="background-color: rgb(25, 137, 250, 0.2)"></el-table-column>
    <!-- v-for="c in cols" c 从 1 开始 -->
    <el-table-column v-for="c in cols" :key="c" :label="num2col(c)" :prop="num2col(c)" width="100">
      <template #default="{ row, column, $index }">
        <el-input
          v-model="row[column.property]"
          :class="getCellClass(c, $index + 1)"
          @input="setCurrentCell(c, $index + 1, row[column.property])"
          @focus="setCurrentCell(c, $index + 1, row[column.property])"
          @dragover="$event.preventDefault()"
          @dragenter="$event.target.style.borderColor = cellBorderColor"
          @dragleave="$event.target.style.borderColor = ''"
          @drop="drop($event, row, column.property, c, $index)"
        ></el-input>
      </template>
    </el-table-column>
  </el-table>
  <p>{{ inputData }} </p>
</template>
<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { num2col } from '@/utils/index.ts'
  import reportControl from './report.ts'

  // 初始table的行数列数
  const cols = ref(10)
  const rows = ref(6)
  const inputData = reactive<RowData[]>([])
  for (let r = 1; r <= rows.value; r++) {
    const rowData: RowData = {}
    for (let c = 1; c <= cols.value; c++) {
      rowData[num2col(c)] = ''
    }
    inputData.push(rowData)
  }

  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cssVars,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    currentCellName,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    currentCellData,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getCellClass,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    headerCellStyle,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    rowStyle,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setCurrentCell,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    drop,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cellInput
  } = reportControl(cols, rows, inputData)
</script>

<style lang="scss" scoped>
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
