import { DataSource } from '../type'

interface StateType {
  current: DataSource | undefined //当前选择的entity
}

const state = (): StateType => ({
  current: undefined
})

const actions = {
  setCurrent(context: any, data: { ds: DataSource; index: number }) {
    context.commit('setCurrent', data)
  }
}

const mutations = {
  setCurrent: (state: StateType, data: { ds: DataSource; index: number }) => {
    state.current = data.ds
  }
}

const getters = {}

export default {
  dataSource: {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
  }
}
