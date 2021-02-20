/**
 * 存储分装对外提供统一的方法及接口使用
 * Localstorage 存储到客户端
 */
class LocalStorage {
  set(key: string, value: string): void {
    try {
      localStorage.setItem(key, value)
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        throw new Error('Out of Memory Limit Localstorage')
      } else {
        throw new Error(e.name)
      }
    }
  }

  get(key: string): string {
    return localStorage.getItem(key) || ''
  }

  remove(key: string): void {
    localStorage.removeItem(key)
  }

  setExpire(key: string, value: string, expire: number): void {
    const currTime = new Date().getTime()
    return this.set(key, JSON.stringify({ val: value, time: currTime + expire }))
  }

  getExpire(key: string): string {
    const val: string = this.get(key)
    const dataObj = JSON.parse(val)
    if (new Date().getTime() - dataObj.time > 0) {
      return dataObj.val
    } else {
      return ''
    }
  }
}

// 单列模式返回对象
let instance
const localStore = (() => {
  if (instance) return instance
  instance = new LocalStorage()
  return instance
})()

export { localStore }
