import Abstract from '../abstract'

class DataSource extends Abstract {
  getGroups() {
    return this.get({ url: '/ds/groups' })
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
