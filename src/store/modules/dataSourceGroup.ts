import { DataSourceGroup, DataSource } from '../type'

interface StateType {
  list: DataSourceGroup[] //全部entity列表
  size: number //列表大小
  existsNew: boolean //当前是否处于新建状态
}

const state = (): StateType => ({
  list: [],
  size: 0,
  existsNew: false
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

  createDataSource: (context: any, payload: { data: DataSource; groupIndex: number }) => {
    context.commit('createDataSource', payload)
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
      if (index.originIndex < index.targetIndex) {
        //向下移动, originIndex = targetIndex, 并且把区间内元素全部减1
        state.list[index.originIndex].seq = index.targetIndex
        for (let i = index.targetIndex; i > index.originIndex; i--) {
          state.list[i].seq = state.list[i].seq - 1
        }
      } else if (index.originIndex > index.targetIndex) {
        //向上移动 originIndex = targetIndex, 并且把区间内元素全部加1
        state.list[index.originIndex].seq = index.targetIndex
        for (let i = index.targetIndex; i < index.originIndex; i++) {
          state.list[i].seq = state.list[i].seq + 1
        }
      }
      // 重新排序
      state.list.sort((obj1, obj2) => {
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
      for (let i = 0; i < state.list.length; i++) {
        state.list[i].seq = i
      }

      index.callback(state.list)
    }
  },

  createDataSource: (state: StateType, payload: { data: DataSource; groupIndex: number }) => {
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
