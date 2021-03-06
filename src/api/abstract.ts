import { ElMessage } from 'element-plus'
import { API_DOMAIN } from '@/utils/env'
import { AxiosRequest, CustomResponse } from './types'
import { localStore } from '@/utils/storage/localStorage'
import instance from './intercept'

class Abstract {
  protected baseURL: string = API_DOMAIN

  protected headers: object = {
    ContentType: 'application/json;charset=UTF-8'
  }

  private apiAxios({
    baseURL = this.baseURL,
    headers = this.headers,
    method,
    url,
    data,
    params,
    responseType
  }: AxiosRequest): Promise<CustomResponse> {
    // if (url.indexOf('/api') === -1) {
    //   url = `/api${url}`
    // }
    Object.assign(headers, {
      Authorization: `Bearer ${localStore.get('token')}`
    })
    return new Promise((resolve, reject) => {
      instance({ baseURL, headers, method, url, params, data, responseType })
        .then(resp => {
          if (resp.status === 200) {
            resolve({
              status: resp.status,
              statusText: resp.statusText,
              origin: resp.data,
              success: resp.data.success,
              data: resp.data?.data,
              message: resp.data?.message
            })
          } else {
            resolve({
              status: resp.status,
              statusText: resp.statusText,
              origin: resp.data,
              success: false,
              data: null
            })
          }
        })
        .catch(err => {
          const message = err?.data?.errorMessage || err?.message || url + '请求失败'
          ElMessage.error(message)
          reject({
            status: 0,
            statusText: err?.data?.errorMessage || err?.message,
            origin: null,
            success: false,
            data: null
          })
        })
    })
  }

  /**
   * GET类型的网络请求
   */
  protected get({ baseURL, headers, url, data, params, responseType }: AxiosRequest) {
    return this.apiAxios({ baseURL, headers, method: 'get', url, data, params, responseType })
  }

  /**
   * POST类型的网络请求
   */
  protected post({ baseURL, headers, url, data, params, responseType }: AxiosRequest) {
    return this.apiAxios({ baseURL, headers, method: 'post', url, data, params, responseType })
  }
}

export default Abstract
