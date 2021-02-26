import Abstract from '../abstract'

class Auth extends Abstract {
  login(data: {}) {
    return this.post({ url: '/auth/login', data })
  }
}

// 单列模式返回对象
let instance
const authApi = (() => {
  if (instance) return instance
  instance = new Auth()
  return instance
})()

export { authApi }
