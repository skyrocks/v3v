import { createStore } from 'vuex'
import Database from './modules/database'
import DataSourceGroup from './modules/dataSourceGroup'
import DataSource from './modules/dataSource'

export default createStore({
  modules: {
    ...Database,
    ...DataSourceGroup,
    ...DataSource
  }
})
