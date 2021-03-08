import Abstract from '../abstract'
import { DataSourceGroup } from '@/store/type'
class DataSource extends Abstract {
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

  sqlRun(sql: string) {
    return this.post({ url: '/ds/sql/run', data: { sql } })
  }
}

// 单列模式返回对象
let instance
const dsApi = (() => {
  if (instance) return instance
  instance = new DataSource()
  return instance
})()

export { dsApi }
