import { Database, newId } from '../type'

interface StateType {
  current: Database | undefined //当前选择的entity
  currentIndex: number //当前选择的entity的index
  dbArray: Database[] //全部entity列表
  size: number //列表大小
  existsNew: boolean //当前是否处于新建状态
}

const create = (name = ''): Database => {
  const data: Database = {
    databaseId: newId,
    name: name,
    host: '',
    port: 0,
    dbName: '',
    instance: '',
    sid: '',
    provider: 'mariadb',
    username: '',
    password: '',
    status: 0
  }
  return data
}

const state = (): StateType => ({
  current: undefined,
  currentIndex: -1,
  dbArray: [],
  size: 0,
  existsNew: false
})

const actions = {
  findAll: (context: any, dbArray: Database[]) => {
    context.commit('setDbArray', dbArray)
  },
  pushNew: (context: any, name: string) => {
    const data = create(name)
    context.commit('pushNew', data)
  },
  setCurrent(context: any, data: { db: Database; index: number }) {
    context.commit('setCurrent', data)
  },
  saveCurrent(context: any, data: { db: Database; isNew: boolean }) {
    context.commit('updateCurrent', data)
  },
  removeCurrent(context: any) {
    context.commit('removeCurrent')
  }
}

const mutations = {
  setDbArray: (state: StateType, data: Database[]) => {
    state.dbArray = data
    state.size = data.length
  },
  pushNew: (state: StateType, data: Database) => {
    state.dbArray.push(data)
    state.size = state.dbArray.length
    state.current = data
    state.currentIndex = state.dbArray.length - 1
    state.existsNew = true
  },
  setCurrent: (state: StateType, data: { db: Database; index: number }) => {
    state.current = data.db
    state.currentIndex = data.index
  },
  updateCurrent: (state: StateType, data: { db: Database; isNew: boolean }) => {
    state.current = data.db
    state.dbArray[state.currentIndex] = data.db
    if (data.isNew) {
      state.existsNew = false
    }
  },
  removeCurrent: (state: StateType) => {
    state.dbArray.splice(state.currentIndex, 1)
    state.size = state.dbArray.length
    if (state.currentIndex > 0) {
      state.currentIndex--
      state.current = state.dbArray[state.currentIndex]
    } else {
      state.current = state.dbArray[state.currentIndex]
    }
  }
}

const getters = {}

export default {
  database: {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
  }
}

export { create }
