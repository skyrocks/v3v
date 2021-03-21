import Abstract from '../abstract'
import { DataSourceGroup, DataSource } from '@/store/type'
class DataSourceApi extends Abstract {
  getGroups() {
    return this.get({ url: '/ds/groups' })
  }

  createGroup(data: DataSourceGroup) {
    return this.post({ url: '/ds/groups/create', data })
  }
  updateGroup(data: DataSourceGroup) {
    return this.post({ url: '/ds/groups/update', data })
  }
  removeGroup(groupId: string) {
    return this.post({ url: '/ds/groups/delete', data: { groupId } })
  }

  sortGroup(data: { [key: string]: boolean }) {
    return this.post({ url: '/ds/groups/sort', data })
  }

  getDs(dataSourceId: string) {
    return this.get({ url: `/dss/${dataSourceId}` })
  }

  updateDs(data: DataSource) {
    return this.post({ url: '/dss/update', data })
  }
  createDs(data: DataSource) {
    return this.post({ url: '/dss/create', data })
  }
  removeChild(child: DataSource) {
    return this.post({ url: '/dss/delete', data: child })
  }

  sqlRun(sql: string, params: {}, database: string) {
    return this.post({ url: '/sql/run', data: { sql, params, database } })
  }
}

// 单列模式返回对象
let instance
const dsApi = (() => {
  if (instance) return instance
  instance = new DataSourceApi()
  return instance
})()

export { dsApi }
