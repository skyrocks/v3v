export type FormulaDirec = 'down' | 'left' | 'right' | 'up' | 'none'
export type FormulaType = 'nav' | 'general'

export default function formula() {
  const getFormulaData = (
    data: string,
    type: FormulaType | undefined = undefined,
    direc: FormulaDirec | undefined = undefined
  ) => {
    // 默认获取导航并向下搜寻的公式
    if (type === undefined) {
      type = 'nav'
    }
    if (direc === undefined) {
      direc = 'down'
    }

    if (type === 'nav') {
      let suffix = ''
      if (direc === 'down') {
        suffix = 'd'
      } else if (direc === 'left') {
        suffix = 'l'
      } else if (direc === 'right') {
        suffix = 'r'
      } else if (direc === 'up') {
        suffix = 'u'
      }
      if (suffix === '') {
        return `=${data}`
      } else {
        return `=${type}${suffix}(${data})`
      }
    } else {
      return data
    }
  }

  const getOriginData = (formulaData: string) => {
    formulaData = formulaData.trim()
    if (formulaData.substr(0, 1) === '=') {
      const data = formulaData.match(/=nav[u|l|d|r]\((.+?)\)/)
      if (data === null) {
        return formulaData.substring(1)
      } else {
        return data[1]
      }
    } else {
      return formulaData
    }
  }

  const parseFormulaData = (formulaData: string): { type: FormulaType; dir: FormulaDirec } => {
    formulaData = formulaData.trim()
    if (formulaData.substr(0, 1) === '=') {
      const nav = /=nav[u|l|d|r]\((.+?)\)/.test(formulaData)
      if (nav) {
        let dir: FormulaDirec = 'none'
        const suffix = formulaData.substr(4, 1)
        if (suffix === 'd') {
          dir = 'down'
        } else if (suffix === 'l') {
          dir = 'left'
        } else if (suffix === 'r') {
          dir = 'right'
        } else if (suffix === 'u') {
          dir = 'up'
        }
        return { type: 'nav', dir }
      } else {
        return { type: 'nav', dir: 'none' }
      }
    } else {
      return { type: 'general', dir: 'none' }
    }
  }

  return { getFormulaData, getOriginData, parseFormulaData }
}
