import request from '@/utils/request/request'
import { baseUrl } from './index'
import { exportFile } from '@/utils'

/**
 * 导出点击报价统计
 */
export const exportClickProduct = (data: Record<string, any>, filename = '点击报价统计.xls') => {
  return exportFile(baseUrl, '/statistics/export/click/product', data, filename)
}

/**
 * 点击报价统计
 */
export const clickProduct = (data: object, loading?: boolean) => {
  return request(`${baseUrl}/statistics/click/product`, 'post', data, loading)
}

/**
 * 串流行情套餐统计
 */
export const quo = (data: object, loading?: boolean) => {
  return request(`${baseUrl}/statistics/quo`, 'post', data, loading)
}

/**
 * 串流行情产品统计
 */
export const quoProduct = (data: object, loading?: boolean) => {
  return request(`${baseUrl}/statistics/quo/product`, 'post', data, loading)
}

/**
 * 套餐订购报表
 */
export const packageOrder = (data: object, loading?: boolean) => {
  return request(`${baseUrl}/statistics/package`, 'post', data, loading)
}

// 导出串流行情产品统计
export const productExport = (data: Record<string, any>, filename = '串流行情产品统计.xls') => {
  return exportFile(baseUrl, '/statistics/export/quo/product', data, filename)
}

// 导出串流行情产品统计
export const sendExport = (data: Record<string, any>, filename = '串流行情套餐统计.xls') => {
  return exportFile(baseUrl, '/statistics/export/quo', data, filename)
}

/**
 * 套餐订购报表导出
 */
export const packageExport = (data: object, loading?: boolean) => {
  return request(`${baseUrl}/statistics/export/package`, 'post', data, loading)
}

/**
 * 扣费记录
 */
export const payList = (data: object, loading?: boolean) => {
  return request(`${baseUrl}/order/pay/log`, 'post', data, loading)
}

/**
 * 扣费记录导出
 */
export const payExport = (data: object, loading?: boolean) => {
  return request(`${baseUrl}/statistics/export/package`, 'post', data, loading)
}

// 套餐订购报表导出 order-list
// 串流行情套餐统计导出模板
export const orderListExport = (data: Record<string, any>, filename = '批量导出模板.xls') => {
  return exportFile(baseUrl, '/statistics/export/package', data, filename)
}

// 订购管理-点击报价订购记录-审核
export const orderReview = (data: object) => {
  return request(`${baseUrl}/order/review`, 'post', data)
}

// 上报报表-订购明细表-导出
export const statisticsExportOrder = (
  data: Record<string, any>,
  filename = '串流行情产品统计.xls'
) => {
  return exportFile(baseUrl, '/statistics/export/order/detail', data, filename)
}
// 上报报表-试用表-导出
export const statisticsExportTrial = (
  data: Record<string, any>,
  filename = '串流行情产品统计.xls'
) => {
  return exportFile(baseUrl, '/statistics/export/trial/list', data, filename)
}

// 上报报表-NYSE美股行情用户声明表-导出
export const userDeclarationExportOrder = (
  data: Record<string, any>,
  filename = 'NYSE美股行情用户声明表.xls'
) => {
  return exportFile(baseUrl, '/statistics/export/us/pi/list', data, filename)
}

// 上报报表-NYSE美股行情上报表-导出
export const marketReportExportOrder = (
  data: Record<string, any>,
  filename = 'NYSE美股行情上报表.xls'
) => {
  return exportFile(baseUrl, '/statistics/export/us/order/detail', data, filename)
}

// 订购管理-字典类型-审核类型
export const getByTypes = (data: object) => {
  return request(`${baseUrl}/admin/sys/dict/getByTypes`, 'post', data)
}

// 订购管理-字典类型-审核类型
export const getProgress = (data: object) => {
  return request(`${baseUrl}/statistics/get/import/progress`, 'post', data)
}
