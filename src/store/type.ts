export const newId = 'newId'

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

export interface DataSourceGroup {
  groupId: string
  groupName: string
  seq: number
}

export interface DataSource {
  dataSourceId: string
  name: string
  sqlText: string
  databaseId: string
  groupId: string
}
