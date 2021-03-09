import { authApi } from '@/api/modules/auth'
import { User } from '../type'

interface StateType {
  user: User | undefined
}

const state = (): StateType => ({
  user: undefined
})

const actions = {
  getProfile: async (context: any) => {
    await authApi.profile().then(resp => {
      if (resp.success) {
        context.commit('getProfile', resp.data)
      }
    })
  }
}

const mutations = {
  getProfile: (state: StateType, payload: User) => {
    state.user = payload
  }
}

const getters = {
  user: (state: StateType) => state.user
}

export default {
  auth: {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
  }
}
