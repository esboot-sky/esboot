enum HTTP_STATUS {
  '请求成功' = 200,
  '请求已创建' = 201,
  '请求已接受' = 202,
  '错误请求!' = 400,
  '用户没有权限!' = 401,
  '拒绝访问!' = 403,
  '请求错误, 未找到该资源!' = 404,
  '服务器发生错误，请检查服务器!' = 500,
  '网关错误!' = 502,
  '服务不可用，服务器暂时过载或维护!' = 503,
  '连接超时!' = 504
}

export const getHttpStatusText = function (code: number, err?: any): string {
  if (err && err.response && err.response.status) {
    code = err.response.status
  }
  if (HTTP_STATUS[code]) return HTTP_STATUS[code]
  if (typeof err === 'string' && err.indexOf('timeout') > -1) {
    return '请求超时，请稍后重试！'
  }
  if (typeof err === 'string' && err.indexOf('Network') > -1) {
    return '请求失败, 请检查网络连接'
  }
  return `未知错误`
}
