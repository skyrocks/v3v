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

export interface DataSource {
  dataSourceId: string
  name: string
  sqlText: string
  databaseId: string
  groupId: string
}

export interface DataSourceGroup {
  groupId: string
  groupName: string
  seq: number
  dataSources: DataSource[]
}
