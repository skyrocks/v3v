import Abstract from '../abstract'

class User extends Abstract {
  getUser(params: {}) {
    return this.get({ url: '/users/0/5', params })
  }
}

// 单列模式返回对象
let instance
const userApi = (() => {
  if (instance) return instance
  instance = new User()
  return instance
})()

export { userApi }
