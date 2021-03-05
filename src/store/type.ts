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
