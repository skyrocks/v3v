import Abstract from '../abstract'

class Report extends Abstract {
  getGroups() {
    return this.get({ url: '/report/groups' })
  }
}

// 单列模式返回对象
let instance
const reportApi = (() => {
  if (instance) return instance
  instance = new Report()
  return instance
})()

export { reportApi }
