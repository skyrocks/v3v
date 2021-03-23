export function num2col(num: number): string {
  return String.fromCharCode(64 + num)
}

export function getAppHeight() {
  return document.documentElement.clientHeight
}

export function getContextHeight() {
  return document.documentElement.clientHeight - 60
}

export function listSore(list: any[], originIndex: number, targetIndex: number) {
  if (targetIndex >= 0 && targetIndex <= list.length) {
    if (originIndex < targetIndex) {
      //向下移动, originIndex = targetIndex, 并且把区间内元素全部减1
      list[originIndex].seq = targetIndex
      for (let i = targetIndex; i > originIndex; i--) {
        list[i].seq = list[i].seq - 1
      }
    } else if (originIndex > targetIndex) {
      //向上移动 originIndex = targetIndex, 并且把区间内元素全部加1
      list[originIndex].seq = targetIndex
      for (let i = targetIndex; i < originIndex; i++) {
        list[i].seq = list[i].seq + 1
      }
    }
    // 重新排序
    list.sort((obj1, obj2) => {
      const val1 = obj1.seq
      const val2 = obj2.seq
      if (val1 < val2) {
        return -1
      } else if (val1 > val2) {
        return 1
      } else {
        return 0
      }
    })

    //重新修复,避免seq断档
    for (let i = 0; i < list.length; i++) {
      list[i].seq = i
    }
  }
}

export function cloneObject(obj: any) {
  return JSON.parse(JSON.stringify(obj))
}
