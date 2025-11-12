import request from '@/utils/request/request'

// 验证码
export const getIdentifyingCode = (data: object, loading?: boolean) => {
  return request('/uc/login/getCode', 'post', data, loading)
}

// 登录
export const login = (data?: object, loading?: boolean) => {
  return request('/uc/login/byPwd', 'post', data, loading)
}
// 登录信息
export const loginInfo = (data?: object, loading?: boolean) => {
  return request('/uc/login/data', 'post', data, loading)
}
// 模块列表
export const getModulesListApi = (data?: object, loading?: boolean) => {
  return request('/uc/login/modules', 'post', data, loading)
}
// 获取权限菜单、按钮
// const cachePermission = new Map<string, any>()
// export const getMenuBtnList = (data?: object, loading?: boolean) => {
//   const { moduleCode } = data as { moduleCode: string }
//   const cacheKey = `${moduleCode}`

//   if (cachePermission.has(cacheKey)) {
//     return Promise.resolve(cachePermission.get(cacheKey))
//   }
//   return request('/uc/home/moduleInfo', 'post', data, loading).then((res) => {
//     cachePermission.set(cacheKey, res.result)
//     return res.result
//   })
// }
// 首页数据 - 登录信息
export const systemLoginInfo = (data?: object, loading?: boolean) => {
  return request('/uc/home/loginInfo', 'post', data, loading)
}

// 获取外部模块链接
export const getExternalModuleUrl = (data?: object, loading?: boolean) => {
  return request('/uc/user/getModuleUrl', 'post', data, loading)
}
// 模块列表（多模块）
export const getMultiModuleList = (data?: object, loading?: boolean) => {
  return request('/uc/home/moduleList', 'post', data, loading)
}

// 获取语言列表
export const getLanguageList = (data?: object, loading?: boolean) => {
  return request('/uc/common/dictList', 'post', data, loading)
}

// 获取语言列表 - 不需要token
export const getLanguageConfig = (data?: object, loading?: boolean) => {
  return request('/uc/common/dictLang', 'post', data, loading)
}

// 修改密码
export const changePassword = (data?: object, loading?: boolean) => {
  return request('/uc/my/modifyPwd', 'post', data, loading)
}
