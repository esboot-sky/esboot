import axios, { AxiosRequestConfig, Method, AxiosInstance } from 'axios'
import { ElLoading, ElMessage } from 'element-plus'
import 'element-plus/es/components/loading/style/css'
import 'element-plus/es/components/message/style/css'
import { BASE_URL, TIME_OUT } from './config'
import { languageMapping } from '../index'
import store from '@/store'
import passCode from './code'

/**
 * 接口返回类型 (根据后端返回的格式定义)
 * @interface ResponseType
 */
export interface ResponseType<T> {
  result: T
  message: string
  code: number
}

let loadingInstance: { [name: string]: any }
/* 创建一个axios实例 */
const reqInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  withCredentials: true,
})

// request interceptor
reqInstance.interceptors.request.use((config) => {
  if (config.data?.loading) {
    loadingInstance = ElLoading.service({
      lock: true,
      text: 'Loading',
      fullscreen: false,
      background: 'rgba(0, 0, 0, 0.7)',
    })
  }
  // 自定义headers
  config.headers = {
    ...config.headers,
    moduleCode: store.state.currentModule?.code,
    token: store.state.token,
    'Accept-Language': languageMapping[store.state.language] || languageMapping.cn,
  }
  return config
})

// response interceptor
reqInstance.interceptors.response.use(
  (response) => {
    loadingInstance?.close()
    // blob类型数据直接通过
    if (response && response.config && response.config.responseType === 'blob') {
      return Promise.resolve(response)
    }
    // 业务code不通过时，弹出错误信息
    if (response && response.data && !passCode.includes(response.data.code)) {
      ElMessage({
        // showClose: true,
        message: response.data.message,
        type: 'error',
      })

      // token过期
      if (response.data.code === 990151) {
        store.dispatch('logout')
      }

      return Promise.reject(response.data.message)
    }
    return Promise.resolve(response)
  },
  (error) => {
    loadingInstance?.close()
    return Promise.reject(error)
  }
)

/**
 * 封装request
 *
 * @param {string} url
 * @param {Method} method
 * @param {*} [data]
 * @param {boolean} [loading]
 * @returns {Promise<ResponseType>}
 */
export default function request(
  url: string,
  method: Method,
  data?: Record<string, any>,
  loading?: boolean,
  config?: AxiosRequestConfig
): Promise<any> {
  /* 请求公共参数配置 */
  const publicParams = { loading }
  // 合并公共参数
  const reqData = { ...publicParams, ...data }
  const options: AxiosRequestConfig = {
    url,
    method,
    params: method.toUpperCase() === 'GET' || method.toUpperCase() === 'DELETE' ? reqData : null,
    data: method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT' ? reqData : null,
    headers: {
      'Content-Type': 'application/json',
    },
    ...config,
  }
  return new Promise((resolve, reject) => {
    reqInstance
      .request(options)
      .then((res) => {
        const resData = res.data as ResponseType<any>
        resolve(resData)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
