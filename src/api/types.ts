export type Method = 'get' | 'post' | 'PUT' | 'DELETE'
export type ResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'

export interface AxiosRequest {
  baseURL?: string
  url: string
  data?: object
  params?: object
  method?: Method
  headers?: object
  timeout?: number
  responseType?: ResponseType
}

export interface AxiosResponse {
  data: any
  headers: object
  request?: object
  status: number
  statusText: string
  config: AxiosRequest
}

export interface CustomResponse {
  readonly status: number
  readonly statusText: string
  readonly success: boolean
  readonly message?: string
  data: any
  origin?: any
}
