import Abstract from '../abstract'
import { ReportGroup, Report } from '@/store/type'

class ReportApi extends Abstract {
  getGroups() {
    return this.get({ url: '/report/groups' })
  }
  createGroup(data: ReportGroup) {
    return this.post({ url: '/report/groups/create', data })
  }
  updateGroup(data: ReportGroup) {
    return this.post({ url: '/report/groups/update', data })
  }
  removeGroup(groupId: string) {
    return this.post({ url: '/report/groups/delete', data: { groupId } })
  }
  sortGroup(data: { [key: string]: boolean }) {
    return this.post({ url: '/report/groups/sort', data })
  }

  getReport(reportId: string) {
    return this.get({ url: `/reports/${reportId}` })
  }
  createReport(data: Report) {
    return this.post({ url: '/reports/create', data })
  }
  removeChild(child: Report) {
    return this.post({ url: '/reports/delete', data: child })
  }
  updateReportName(data: Report) {
    return this.post({ url: '/reports/update/name', data })
  }

  getReportDs(reportId: string) {
    return this.get({ url: `/reports/ds/${reportId}` })
  }
  updateReportDs(reportId: string, dataSourceId: string) {
    return this.post({ url: '/reports/update/ds', data: { reportId, dataSourceId } })
  }
  saveReportBody(reportId: string, content: string) {
    return this.post({ url: '/reports/update/content', data: { reportId, content } })
  }
}

// 单列模式返回对象
let instance
const reportApi = (() => {
  if (instance) return instance
  instance = new ReportApi()
  return instance
})()

export { reportApi }
