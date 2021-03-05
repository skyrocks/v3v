import { createStore } from 'vuex'
import Database from './modules/database'

export default createStore({
  modules: {
    ...Database
  }
})
