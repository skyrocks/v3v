import { Report } from '../type'

interface StateType {
  current: Report | undefined //当前选择的entity
}

const state = (): StateType => ({
  current: undefined
})

const actions = {
  setCurrent(context: any, payload: Report) {
    context.commit('setCurrent', payload)
  }
}

const mutations = {
  setCurrent: (state: StateType, payload: Report) => {
    state.current = payload
  }
}

const getters = {}

export default {
  report: {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
  }
}
