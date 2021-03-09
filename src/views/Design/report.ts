import { Ref, UnwrapRef, ComputedRef, computed, reactive, toRefs, ref, onMounted, onUnmounted } from 'vue'
import { num2col } from '@/utils/index'

// 定义单元格数据结构
export interface RowData {
  [key: string]: string
}

// 定义当前单元格结构
interface CurrentCell {
  rowIndex: number
  colIndex: number
  data: string
}

// 定义导出类型
interface Result {
  cssVars: ComputedRef<{ [key: string]: string }>
  currentCellName: ComputedRef<string>
  currentCellData: Ref<string>
  getCellClass: (colIndex: number, rowIndex: number) => string
  headerCellStyle: (cell: { columnIndex: number }) => string
  rowStyle: (row: { rowIndex: number }) => string
  setCurrentCell: (cellIndex: number, rowIndex: number, cellData: string) => void
  drop: ($event: any, row: RowData, columnProperty: string, colIndex: number, rowIndex: number) => void
  cellInput: () => void
}

export default function reportControl(inputData: UnwrapRef<RowData[]>): Result {
  // 初始化当前单元格
  const currentCell = reactive<CurrentCell>({
    rowIndex: -1,
    colIndex: -1,
    data: ''
  })

  const selectColumnNumStr = ref('')

  // 编辑Cell背景色及边框色
  const cellBgColor = 'rgba(25, 137, 250, 0.1)'
  const cellBorderColor = 'rgba(25, 137, 250, 0.7)'

  const cssVars = computed(() => {
    return {
      '--cellBorderColor': cellBorderColor
    }
  })

  const currentCellName = computed(() => {
    return currentCell.rowIndex !== -1 && currentCell.colIndex !== -1
      ? `${num2col(currentCell.colIndex)}${currentCell.rowIndex}`
      : ''
  })

  const getCellClass = (colIndex: number, rowIndex: number) => {
    return rowIndex === currentCell.rowIndex && colIndex === currentCell.colIndex ? 'cell-focus' : 'cell-blur'
  }

  const headerCellStyle = (cell: { columnIndex: number }) => {
    if (selectColumnNumStr.value !== '') {
      const selectColumnNum = selectColumnNumStr.value.split(',')
      //多选优先
      return cell.columnIndex > 0 && selectColumnNum.indexOf(cell.columnIndex.toString()) >= 0
        ? `background-color: ${cellBgColor}`
        : ''
    } else {
      return cell.columnIndex === currentCell.colIndex ? `background-color: ${cellBgColor}` : ''
    }
  }

  const rowStyle = (row: { rowIndex: number }) => {
    return row.rowIndex + 1 === currentCell.rowIndex ? `background-color: ${cellBgColor}` : ''
  }

  const setCurrentCell = (cellIndex = -1, rowIndex = -1, cellData = '') => {
    currentCell.colIndex = cellIndex
    currentCell.rowIndex = rowIndex
    currentCell.data = cellData
  }

  const drop = ($event: any, row: RowData, columnProperty: string, colIndex: number, rowIndex: number) => {
    const data = JSON.parse($event.dataTransfer.getData('field'))
    row[columnProperty] = data.name
    setCurrentCell(colIndex, rowIndex + 1, data.name)
    $event.target.style.borderColor = ''
  }

  const cellInput = () => {
    inputData[currentCell.rowIndex - 1][num2col(currentCell.colIndex)] = currentCell.data
  }

  const selectColumn = (num: (number | undefined)[]) => {
    selectColumnNumStr.value = num.join(',')
  }

  const mp = mousePosition()
  onMounted(() => {
    mp.init(selectColumn)
  })
  onUnmounted(() => {
    mp.removeEventListener()
  })

  const currentCellData: Ref<string> = { ...toRefs(currentCell) }.data
  return {
    cssVars,
    currentCellName,
    currentCellData,
    getCellClass,
    headerCellStyle,
    rowStyle,
    setCurrentCell,
    drop,
    cellInput
  }
}

function mousePosition() {
  let tHeader: any
  let tHeaderXYRange = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
  const tHeaderColumnX: number[] = []
  let firstSelectColumn = {
    index: -1,
    x: 0
  }
  let lastSelectColumnIndexStr = ''
  let selectColumnCall: (num: (number | undefined)[]) => void

  function init(selectColumn: (num: (number | undefined)[]) => void) {
    selectColumnCall = selectColumn
    tHeader = document.getElementsByClassName('el-table__header')[0]
    const ths = tHeader.getElementsByTagName('th')
    setTimeout(() => {
      const base = ths[0].offsetParent
      tHeaderXYRange = {
        top: base.offsetTop,
        bottom: base.offsetTop + base.offsetHeight,
        left: base.offsetLeft,
        right: base.offsetLeft + base.offsetWidth
      }
      const baseX = base.offsetLeft
      for (let i = 1; i < ths.length; i++) {
        tHeaderColumnX.push(baseX + ths[i].offsetLeft)
      }
    }, 0) // 用异步方式获取, 否则取不到th, 这是一个临时方案

    tHeader.addEventListener('mousedown', mouseDown)
  }

  function mouseDown(e: any): void {
    for (let i = tHeaderColumnX.length; i >= 0; i--) {
      if (tHeaderColumnX[i] < e.pageX) {
        // 从右侧数, 第一个小于当前x的就是选择的columnIndex
        const selectedColumnIndex = []
        selectedColumnIndex.push(i + 1)
        selectColumnCall(selectedColumnIndex)
        firstSelectColumn = { index: i + 1, x: e.pageX }
        lastSelectColumnIndexStr = selectedColumnIndex.join('')
        break
      }
    }
    tHeader.addEventListener('mouseup', mouseUp)
    tHeader.addEventListener('mousemove', mouseMove)
  }

  function mouseUp(): void {
    tHeader.removeEventListener('mousemove', mouseMove)
    tHeader.removeEventListener('mouseup', mouseUp)
  }

  function mouseMove(e: any): void {
    if (
      e.pageY >= tHeaderXYRange.top &&
      e.pageY <= tHeaderXYRange.bottom &&
      e.pageX >= tHeaderXYRange.left &&
      e.pageX <= tHeaderXYRange.right
    ) {
      const selectedColumnIndex = [firstSelectColumn.index]
      if (e.pageX > firstSelectColumn.x) {
        //向右
        tHeaderColumnX.map((value, index) => {
          if (index + 1 > firstSelectColumn.index && value < e.pageX) {
            selectedColumnIndex.push(index + 1)
          }
        })
      }
      if (e.pageX < firstSelectColumn.x) {
        //向左
        tHeaderColumnX.map((value, index) => {
          if (index < firstSelectColumn.index && value > e.pageX) {
            selectedColumnIndex.push(index)
          }
        })
      }
      if (lastSelectColumnIndexStr !== selectedColumnIndex.join('')) {
        selectColumnCall(selectedColumnIndex)
        lastSelectColumnIndexStr = selectedColumnIndex.join('')
      }
    }
  }

  // 删掉所有鼠标事件监听
  function removeEventListener(): void {
    mouseUp()
    tHeader.removeEventListener('mousedown', mouseDown)
  }
  return { init, mouseDown, removeEventListener }
}
