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
    <el-table-column v-for="c in cols" :key="c" :label="num2col(c)" :prop="num2col(c)" width="100">
      <template #default="{ row }">
        <el-input
          v-model="row[num2col(c)]"
          :class="getCellClass(row, c)"
          @input="setCurrentCell(c, row.index, row[num2col(c)])"
          @focus="setCurrentCell(c, row.index, row[num2col(c)])"
          @dragover="$event.preventDefault()"
          @dragenter="$event.target.style.borderColor = cellBorderColor"
          @dragleave="$event.target.style.borderColor = ''"
          @drop="drop($event, row, c)"
        ></el-input>
      </template>
    </el-table-column>
  </el-table>
  <p>{{ inputData }} </p>
</template>
<script setup lang="ts">
  import { ref, reactive, computed } from 'vue'
  import { num2col } from '@/utils/index.ts'

  const cols = ref(10)
  const rows = ref(6)
  let inputData = reactive([])
  for (let r = 1; r <= rows.value; r++) {
    let rowData = { index: r, focus: false }
    for (let c = 1; c <= cols.value; c++) {
      rowData[num2col(c)] = r === 1 ? '=name' : ''
    }
    inputData.push(rowData)
  }

  // 编辑Cell背景色及边框色
  const cellBgColor = 'rgba(25, 137, 250, 0.1)'
  const cellBorderColor = 'rgba(25, 137, 250, 0.7)'
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const cssVars = computed(() => {
    return {
      '--cellBorderColor': cellBorderColor
    }
  })

  const currentColIndex = ref(-1)
  const currentRowIndex = ref(-1)
  let currentCellData = ref('')

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const currentCellName = computed(() => {
    return currentRowIndex.value !== -1 && currentColIndex.value !== -1
      ? `${num2col(currentColIndex.value)}${currentRowIndex.value}`
      : ''
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getCellClass = (row, c) => {
    return row.index === currentRowIndex.value && c === currentColIndex.value ? 'cell-focus' : 'cell-blur'
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const headerCellStyle = (c) => {
    return c.columnIndex === currentColIndex.value ? `background-color: ${cellBgColor}` : ''
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const rowStyle = (row) => {
    return row.rowIndex + 1 === currentRowIndex.value ? `background-color: ${cellBgColor}` : ''
  }

  const setCurrentCell = (cellIndex = -1, rowIndex = -1, cellData = '') => {
    currentColIndex.value = cellIndex
    currentRowIndex.value = rowIndex
    currentCellData.value = cellData
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const cellInput = () => {
    inputData[currentRowIndex.value - 1][num2col(currentColIndex.value)] = currentCellData.value
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const drop = (e, row, c) => {
    const data = JSON.parse(e.dataTransfer.getData('field'))
    row[num2col(c)] = data.name
    setCurrentCell(c, row.index, data.name)
    e.target.style.borderColor = ''
  }
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
