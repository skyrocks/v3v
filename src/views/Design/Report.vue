<template>
  <el-row>
    <el-col :span="4">
      <el-input v-model="currentCellName" readonly class="cell-name" @focus="cellInputFocus" @blur="cellInputBlur" />
    </el-col>
    <el-col :span="20">
      <el-input v-model="currentCellData" @input="cellInput" @focus="cellInputFocus" @blur="cellInputBlur" />
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
          @input="inputting(row, c)"
          @focus="inputFocus(row, c)"
          @blur="inputBlur(row, c)"
          @dragover="(e) => e.preventDefault()"
          @dragenter="dragEnter($event, row, c)"
          @dragleave="dragLeave($event, row, c)"
          @drop="drop($event, row, c)"
        ></el-input>
      </template>
    </el-table-column>
  </el-table>
  <p>{{ inputData }} </p>
</template>
<script setup>
  import { ref, reactive, computed } from 'vue'
  import { num2col } from '@/utils/index.ts'

  const cols = ref(10)
  const rows = ref(6)
  let inputData = reactive([])
  for (let r = 1; r <= rows.value; r++) {
    let rowData = { index: r }
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
      '--cellBgColor': cellBgColor,
      '--cellBorderColor': cellBorderColor
    }
  })

  const currentColIndex = ref(-1)
  const currentRowIndex = ref(-1)
  let currentCellData = ref('')
  let currentCellCopy = { currentColIndex: -1, currentRowIndex: -1, currentCellData: '' }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const currentCellName = computed(() => {
    return currentRowIndex.value !== -1 && currentColIndex.value !== -1
      ? `${num2col(currentColIndex.value)}${currentRowIndex.value}`
      : ''
  })
  const setCurrentCell = (cellIndex = -1, rowIndex = -1, cellData = '') => {
    currentColIndex.value = cellIndex
    currentRowIndex.value = rowIndex
    currentCellData.value = cellData
    if (cellIndex !== -1 || rowIndex !== -1) {
      currentCellCopy = { currentColIndex: cellIndex, currentRowIndex: rowIndex, currentCellData: cellData }
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const headerCellStyle = (c) => {
    if (c.columnIndex === currentColIndex.value) {
      return `background-color: ${cellBgColor}`
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const rowStyle = (row) => {
    if (row.rowIndex + 1 === currentRowIndex.value) {
      return `background-color: ${cellBgColor}`
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const cellInputFocus = () => {
    setCurrentCell(currentCellCopy.currentColIndex, currentCellCopy.currentRowIndex, currentCellCopy.currentCellData)
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const cellInputBlur = () => {
    setCurrentCell()
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const cellInput = () => {
    inputData[currentRowIndex.value - 1][num2col(currentColIndex.value)] = currentCellData.value
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const inputting = (row, c) => {
    setCurrentCell(c, row.index, row[num2col(c)])
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const inputFocus = (row, c) => {
    setCurrentCell(c, row.index, row[num2col(c)])
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const inputBlur = () => {
    setCurrentCell()
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dragEnter = (e, row, c) => {
    setCurrentCell(c, row.index, row[num2col(c)])
    e.target.style.borderColor = cellBorderColor
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dragLeave = (e, row, c) => {
    e.target.style.borderColor = 'transparent'
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const drop = (e, row, c) => {
    const data = JSON.parse(e.dataTransfer.getData('field'))
    row[num2col(c)] = data.name
    e.target.className = 'el-input__inner'
    e.target.style.borderColor = 'transparent'
    setCurrentCell()
  }
</script>

<style lang="scss" scoped>
  ::v-deep(.cell-name input) {
    text-align: center;
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
  ::v-deep(.el-table__header th) {
    text-align: center;
  }
  ::v-deep(.el-table__body td) {
    text-align: center;
  }

  ::v-deep(.el-input__inner) {
    border-radius: 0;
  }
  ::v-deep(.el-table__body .el-input__inner) {
    border-color: transparent;
  }
  ::v-deep(.el-table__body .el-input__inner:focus) {
    border-color: var(--cellBorderColor);
  }
</style>
