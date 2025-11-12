import { createDZAxiosInstance } from '@dz-web/axios'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { createBasicPatternMiddleware } from '@dz-web/axios-middlewares'
import { IJavaAPICommonResponse } from './types'
import store from '@/store'

export const langType: { [key: string]: string } = {
  cn: 'zh-CN',
  hk: 'zh-TW',
  us: 'en-US',
}

const isBusinessError = (data: IJavaAPICommonResponse) => {
  return data.code !== 0
}
const baseURL = window.APP_CONFIG.COMMON_SERVERS.base

const StatusCodes = {
  SUCCESS: 0,
  LOGIN_FAILURE: 990151,
}

const isExpired = (code: number) => code === StatusCodes.LOGIN_FAILURE

function onFatalError(error: any, data: any) {
  console.error('fatal error', error, data)
  ElMessage({
    message: error?.message,
    type: 'error',
  })
}

function onNetworkError(error: any) {
  ElMessage({
    message: error?.message,
    type: 'error',
  })
}

function addHeaders(config: any) {
  // moduleCode是统一的，但个别接口需要自己指定，如系统管理 -> 角色管理 -> 新建角色 -> 设置权限 -> 获取权限树
  const preferredModuleCode = config.headers?.moduleCode

  return {
    moduleCode: preferredModuleCode || store.state.currentModule?.code,
    token: store.state.token,
    'Accept-Language': langType[store.state.language] || langType.cn,
  }
}

function createAuthorizedCommonJavaInst(suppressErrorTips = false) {
  return createDZAxiosInstance(
    () =>
      axios.create({
        baseURL,
        withCredentials: true,
      }),
    [
      createBasicPatternMiddleware({
        addHeaders,
        isBusinessError,
        onBusinessError: (data) => {
          if (isExpired(data.code)) {
            store.dispatch('logout')
          }
          if (!suppressErrorTips) {
            ElMessage({
              message: data.message,
              type: 'error',
            })
          }
        },
        onFatalError: suppressErrorTips ? undefined : onFatalError,
        onNetworkError: suppressErrorTips ? undefined : onNetworkError,
      }),
    ]
  )
}

export const authorizedCommonJavaInst = createAuthorizedCommonJavaInst()
/**
 * 不自动提示错误的axios实例
 */
export const authorizedCommonJavaInstSuppressErrorTips = createAuthorizedCommonJavaInst(true)

// 专用于下载文件
export const authorizedCommonFileJavaInst = createDZAxiosInstance(
  () =>
    axios.create({
      baseURL,
      withCredentials: true,
    }),
  [
    createBasicPatternMiddleware({
      addHeaders,
      isBusinessError: () => false,
      onFatalError,
      onNetworkError,
    }),
  ]
)

export const commonJavaInst = createDZAxiosInstance(
  () =>
    axios.create({
      baseURL,
      withCredentials: true,
    }),
  [
    createBasicPatternMiddleware({
      addHeaders,
      isBusinessError,
      onBusinessError: (data) => {
        ElMessage({
          message: data.message,
          type: 'error',
        })
      },
      onFatalError,
      onNetworkError,
    }),
  ]
)
