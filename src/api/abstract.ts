import { getCurrentInstance } from 'vue'
import { API_DOMAIN } from '@/utils/env'
import { AxiosRequest, CustomResponse } from './types'
import { cookie } from '@/utils/storage/cookie'
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
      Authorization: cookie.get('token')
    })
    return new Promise((resolve, reject) => {
      instance({ baseURL, headers, method, url, params, data, responseType })
        .then((res) => {
          if (res.status === 200) {
            if (res.data.success) {
              resolve({ status: true, message: 'success', data: res.data?.data, origin: res.data })
            } else {
              this.$message()({ type: 'error', message: res.data?.errorMessage || url + '请求失败' })
              resolve({
                status: false,
                message: res.data?.errorMessage || url + '请求失败',
                data: res.data?.data,
                origin: res.data
              })
            }
          } else {
            resolve({ status: false, message: res.data?.errorMessage || url + '请求失败', data: null })
          }
        })
        .catch((err) => {
          const message = err?.data?.errorMessage || err?.message || url + '请求失败'
          this.$message()({ message })
          reject({ status: false, message, data: null })
        })
    })
  }

  protected $message() {
    const vueInstance = getCurrentInstance()
    if (vueInstance) {
      return vueInstance.appContext.config.globalProperties.$message
    } else {
      return null
    }
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
