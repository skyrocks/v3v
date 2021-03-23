import { createStore } from 'vuex'
import getters from './getters'
import Auth from './modules/auth'
import Database from './modules/database'
import DataSourceGroup from './modules/dataSourceGroup'
import DataSource from './modules/dataSource'
import ReportGroup from './modules/reportGroup'
import Report from './modules/report'

export default createStore({
  modules: {
    ...Auth,
    ...Database,
    ...DataSourceGroup,
    ...DataSource,
    ...ReportGroup,
    ...Report
  },
  getters
})
