import request from '@/utils/request/request'
import { exportFile } from '@/utils'
import { baseUrlUc, baseUrl } from '.'

// 客户列表
export const customerList = (data: object) => {
  return request(`${baseUrl}/cus/list`, 'post', data)
}

// 客户登录日志
export const loginLogList = (data: object) => {
  return request(`/uc/customer/loginLog/list`, 'post', data)
}

// 客户登录日志导出
export const loginLogExport = (data: Record<string, any>) => {
  return exportFile(baseUrlUc, '/cus/loginLog/list', data, '客户登录日志.xls')
}

// 客户登录列表导出
export const loginListExport = (data: Record<string, any>) => {
  return exportFile(baseUrlUc, 'uc/customer/loginLog/export', data, '客户登录列表.xls')
}

/** 导出用户列表 */
export const exportCusList = (data: Record<string, any>) => {
  return exportFile(baseUrl, '/cus/export/list', data, '用户列表.xls')
}

/** 导出用户列表 */
export const exportCus = (data: Record<string, any>) => {
  return exportFile(baseUrl, '/cus/export/list', data, '用户列表.xls')
}
