import { ReportGroup, Report } from '../type'
import { listSore } from '@/utils/index'

interface StateType {
  list: ReportGroup[] //全部entity列表
  size: number //列表大小
  existsNew: boolean //当前是否处于新建状态
}

const state = (): StateType => ({
  list: [],
  size: 0,
  existsNew: false
})

const actions = {
  setList: (context: any, list: ReportGroup[]) => {
    context.commit('setList', list)
  },
  create: (context: any, data: ReportGroup) => {
    context.commit('create', data)
  },
  update: (context: any, data: { db: ReportGroup; index: number }) => {
    context.commit('update', data)
  },
  remove(context: any, index: number) {
    context.commit('remove', index)
  },
  sort(context: any, index: { originIndex: number; targetIndex: number; callback: Function }) {
    context.commit('sort', index)
  },

  createChild: (context: any, payload: { data: ReportGroup; groupIndex: number }) => {
    context.commit('createChild', payload)
  },

  removeChild: (context: any, payload: { index: number; child: Report }) => {
    context.commit('removeChild', payload)
  }
}

const mutations = {
  setList: (state: StateType, data: ReportGroup[]) => {
    state.list = data
    state.size = state.list.length
  },
  create: (state: StateType, data: ReportGroup) => {
    state.list.push(data)
    state.size = state.list.length
  },
  update: (state: StateType, data: { db: ReportGroup; index: number }) => {
    state.list[data.index] = data.db
  },
  remove: (state: StateType, index: number) => {
    state.list.splice(index, 1)
    state.size = state.list.length
  },
  sort: (state: StateType, index: { originIndex: number; targetIndex: number; callback: Function }) => {
    if (index.targetIndex >= 0 && index.targetIndex <= state.size) {
      listSore(state.list, index.originIndex, index.targetIndex)
      index.callback(state.list)
    }
  },

  createChild: (state: StateType, payload: { data: Report; groupIndex: number }) => {
    state.list[payload.groupIndex].reports.push(payload.data)
  },

  removeChild: (state: StateType, payload: { index: number; child: Report }) => {
    for (let i = 0; i < state.list.length; i++) {
      if (state.list[i].groupId === payload.child.groupId) {
        state.list[i].reports.splice(payload.index, 1)
        break
      }
    }
  }
}

const getters = {}

export default {
  reportGroup: {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
  }
}
