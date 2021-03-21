export const newId = 'newId'

export interface User {
  userStatus: number
  loginName: string
  cellphone: string
  photo: string
  userType: number
  userName: string
  userId: string
  userCode: string
  email: string
}
export interface Database {
  databaseId: string
  name: string
  host: string
  port: number
  dbName: string
  instance: string
  sid: string
  provider: string
  username: string
  password: string
  status: number
}

export interface DataSourceField {
  dataSourceId: string
  fieldKey: string
}
export interface DataSourceParam {
  dataSourceId: string
  paramsKey: string
  paramsName: string
  defaultValue: string
}
export interface DataSource {
  dataSourceId: string
  name: string
  sqlText: string
  databaseId: string
  groupId: string
  params: DataSourceParam[]
  fields: DataSourceField[]
}

export interface DataSourceGroup {
  groupId: string
  groupName: string
  seq: number
  dataSources: DataSource[]
}

export interface Report {
  reportId: string
  reportName: string
  groupId: string
  seq: number
  memo: string
}

export interface ReportGroup {
  groupId: string
  groupName: string
  seq: number
  reports: Report[]
}
