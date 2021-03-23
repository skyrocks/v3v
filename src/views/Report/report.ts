import { Ref, UnwrapRef, ComputedRef, computed, reactive, toRefs, ref, onUnmounted } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
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
  initControl: (inputData: UnwrapRef<RowData[]>) => void
}

export default function reportControl(): Result {
  // 初始化当前单元格
  let _inputData: UnwrapRef<RowData[]>
  const _currentCell = reactive<CurrentCell>({
    rowIndex: -1,
    colIndex: -1,
    data: ''
  })

  const _selectColumnNumStr = ref('')

  // 编辑Cell背景色及边框色
  const _cellBgColor = 'rgba(25, 137, 250, 0.1)'
  const _cellBorderColor = 'rgba(25, 137, 250, 0.7)'

  const cssVars = computed(() => {
    return {
      '--cellBorderColor': _cellBorderColor
    }
  })

  const currentCellName = computed(() => {
    return _currentCell.rowIndex !== -1 && _currentCell.colIndex !== -1
      ? `${num2col(_currentCell.colIndex)}${_currentCell.rowIndex}`
      : ''
  })

  const getCellClass = (colIndex: number, rowIndex: number) => {
    return rowIndex === _currentCell.rowIndex && colIndex === _currentCell.colIndex ? 'cell-focus' : 'cell-blur'
  }

  const headerCellStyle = (cell: { columnIndex: number }) => {
    if (_selectColumnNumStr.value !== '') {
      const selectColumnNum = _selectColumnNumStr.value.split(',')
      //多选优先
      return cell.columnIndex > 0 && selectColumnNum.indexOf(cell.columnIndex.toString()) >= 0
        ? `background-color: ${_cellBgColor}`
        : ''
    } else {
      return cell.columnIndex === _currentCell.colIndex ? `background-color: ${_cellBgColor}` : ''
    }
  }

  const rowStyle = (row: { rowIndex: number }) => {
    return row.rowIndex + 1 === _currentCell.rowIndex ? `background-color: ${_cellBgColor}` : ''
  }

  const setCurrentCell = (cellIndex = -1, rowIndex = -1, cellData = '') => {
    _currentCell.colIndex = cellIndex
    _currentCell.rowIndex = rowIndex
    _currentCell.data = cellData
  }

  const drop = ($event: any, row: RowData, columnProperty: string, colIndex: number, rowIndex: number) => {
    const data = JSON.parse($event.dataTransfer.getData('field'))
    row[columnProperty] = data.fieldKey
    setCurrentCell(colIndex, rowIndex + 1, data.fieldKey)
    $event.target.style.borderColor = ''
  }

  const cellInput = () => {
    _inputData[_currentCell.rowIndex - 1][num2col(_currentCell.colIndex)] = _currentCell.data
  }

  const selectColumn = (num: (number | undefined)[]) => {
    _selectColumnNumStr.value = num.join(',')
  }

  let _mp: any
  const initControl = (inputData: UnwrapRef<RowData[]>) => {
    _inputData = inputData
    _currentCell.colIndex = -1
    _currentCell.rowIndex = -1
    _currentCell.data = ''
    _selectColumnNumStr.value = ''

    _mp = mousePosition()
    _mp.init(selectColumn)
  }

  onUnmounted(() => {
    _mp.removeEventListener()
  })
  onBeforeRouteLeave(() => {
    _mp.removeEventListener()
  })

  const currentCellData: Ref<string> = { ...toRefs(_currentCell) }.data
  return {
    cssVars,
    currentCellName,
    currentCellData,
    getCellClass,
    headerCellStyle,
    rowStyle,
    setCurrentCell,
    drop,
    cellInput,
    initControl
  }
}

function mousePosition() {
  let _tHeader: any // 表头Dom对象
  let _tHeaderXYRange: { top: number; bottom: number; left: number; right: number } //表头的坐标范围
  let _tHeaderColumnX: number[] // 表头中的每一列的left坐标
  let _firstSelectColumn: { index: number; x: number } // 第一个被点中的col对象的index和left坐标
  let _lastSelectColumnIndexStr = '' // 记录鼠标移动过程中的选择的列头索引
  let _selectColumnCall: (num: (number | undefined)[]) => void // 选中的回调函数

  function clearVariable() {
    _tHeaderXYRange = {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    }
    _tHeaderColumnX = []
    _firstSelectColumn = {
      index: -1,
      x: 0
    }
    _lastSelectColumnIndexStr = ''
  }

  function init(selectColumnCall: (num: (number | undefined)[]) => void) {
    _selectColumnCall = selectColumnCall

    _tHeader = document.getElementsByClassName('el-table__header')[0]

    _tHeader.removeEventListener('mousedown', mouseDown)
    _tHeader.addEventListener('mousedown', mouseDown)
  }

  function initPosition() {
    clearVariable()
    const ths = _tHeader.getElementsByTagName('th')
    const base = ths[0].offsetParent
    _tHeaderXYRange = {
      top: base.offsetTop,
      bottom: base.offsetTop + base.offsetHeight,
      left: base.offsetLeft,
      right: base.offsetLeft + base.offsetWidth
    }
    const baseX = base.offsetLeft
    for (let i = 1; i < ths.length; i++) {
      _tHeaderColumnX.push(baseX + ths[i].offsetLeft)
    }
  }

  function mouseDown(e: any): void {
    initPosition() //每次鼠标按下的时候做基准定位, 防止resize情况
    for (let i = _tHeaderColumnX.length; i >= 0; i--) {
      if (_tHeaderColumnX[i] < e.pageX) {
        // 从右侧数, 第一个小于当前x的就是选择的columnIndex
        const selectedColumnIndex = []
        selectedColumnIndex.push(i + 1)
        _selectColumnCall(selectedColumnIndex)
        _firstSelectColumn = { index: i + 1, x: e.pageX }
        _lastSelectColumnIndexStr = selectedColumnIndex.join('')
        break
      }
    }
    _tHeader.addEventListener('mouseup', mouseUp)
    _tHeader.addEventListener('mousemove', mouseMove)
  }

  function mouseUp(): void {
    _tHeader.removeEventListener('mousemove', mouseMove)
    _tHeader.removeEventListener('mouseup', mouseUp)
  }

  function mouseMove(e: any): void {
    if (
      e.pageY >= _tHeaderXYRange.top &&
      e.pageY <= _tHeaderXYRange.bottom &&
      e.pageX >= _tHeaderXYRange.left &&
      e.pageX <= _tHeaderXYRange.right
    ) {
      const selectedColumnIndex = [_firstSelectColumn.index]
      if (e.pageX > _firstSelectColumn.x) {
        //向右
        _tHeaderColumnX.map((value, index) => {
          if (index + 1 > _firstSelectColumn.index && value < e.pageX) {
            selectedColumnIndex.push(index + 1)
          }
        })
      }
      if (e.pageX < _firstSelectColumn.x) {
        //向左
        _tHeaderColumnX.map((value, index) => {
          if (index < _firstSelectColumn.index && value > e.pageX) {
            selectedColumnIndex.push(index)
          }
        })
      }
      if (_lastSelectColumnIndexStr !== selectedColumnIndex.join('')) {
        _selectColumnCall(selectedColumnIndex)
        _lastSelectColumnIndexStr = selectedColumnIndex.join('')
      }
    }
  }

  // 删掉所有鼠标事件监听
  function removeEventListener(): void {
    mouseUp()
    _tHeader.removeEventListener('mousedown', mouseDown)
  }
  return { init, mouseDown, removeEventListener }
}
