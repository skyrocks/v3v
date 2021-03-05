import Abstract from '../abstract'
import { Database } from '@/store/type'

class DatabaseApi extends Abstract {
  getAll(params: { [key: string]: any } = {}) {
    return this.get({ url: '/database', params })
  }
  add(data: Database) {
    return this.post({ url: '/database/create', data })
  }
  update(data: Database) {
    return this.post({ url: '/database/update', data })
  }
  remove(databaseId: string) {
    return this.post({ url: '/database/delete', data: { databaseId } })
  }
  test(data: Database) {
    console.log('test')
    return this.post({ url: '/database/test', data })
  }
}

// 单列模式返回对象
let instance
const databaseApi = (() => {
  if (instance) return instance
  instance = new DatabaseApi()
  return instance
})()

export { databaseApi }
