import { DataSourceGroup, DataSource } from '../type'
import { listSore } from '@/utils/index'

interface StateType {
  list: DataSourceGroup[] //全部entity列表
  size: number //列表大小
}

const state = (): StateType => ({
  list: [],
  size: 0
})

const actions = {
  setList: (context: any, list: DataSourceGroup[]) => {
    context.commit('setList', list)
  },
  create: (context: any, data: DataSourceGroup) => {
    context.commit('create', data)
  },
  update: (context: any, data: { db: DataSourceGroup; index: number }) => {
    context.commit('update', data)
  },
  remove(context: any, index: number) {
    context.commit('remove', index)
  },
  sort(context: any, index: { originIndex: number; targetIndex: number; callback: Function }) {
    context.commit('sort', index)
  },

  createChild: (context: any, payload: { data: DataSource; groupIndex: number }) => {
    context.commit('createChild', payload)
  },

  removeChild: (context: any, payload: { index: number; child: DataSource }) => {
    context.commit('removeChild', payload)
  }
}

const mutations = {
  setList: (state: StateType, data: DataSourceGroup[]) => {
    state.list = data
    state.size = state.list.length
  },
  create: (state: StateType, data: DataSourceGroup) => {
    state.list.push(data)
    state.size = state.list.length
  },
  update: (state: StateType, data: { db: DataSourceGroup; index: number }) => {
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

  createChild: (state: StateType, payload: { data: DataSource; groupIndex: number }) => {
    state.list[payload.groupIndex].dataSources.push(payload.data)
  },

  removeChild: (state: StateType, payload: { index: number; child: DataSource }) => {
    for (let i = 0; i < state.list.length; i++) {
      if (state.list[i].groupId === payload.child.groupId) {
        state.list[i].dataSources.splice(payload.index, 1)
        break
      }
    }
  }
}

const getters = {}

export default {
  dataSourceGroup: {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
  }
}
