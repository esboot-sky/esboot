import request from '@/utils/request/request'
import { exportFile } from '@/utils'
import { baseUrl } from '.'

// 取消自动续期
export const autoRenewReq = (data: object) => {
  return request(`${baseUrl}/order/auto/renew`, 'post', data)
}

// 串流行情订购记录-订购记录-列表
export const orderListReq = (data: object) => {
  return request(`${baseUrl}/order/list/quo`, 'post', data)
}
// 点击报价订购记录-点击报价-列表
export const orderListReqClick = (data: object) => {
  return request(`${baseUrl}/order/list/click`, 'post', data)
}

// 导出订购记录
export const orderListExpor = (data: Record<string, any>, filename = '订购记录.xls') => {
  return exportFile(baseUrl, '/order/export/list', data, filename)
}

// 导出模板
export const templateExport = (data: Record<string, any> = {}, filename = '批量导入模板.xls') => {
  return exportFile(baseUrl, '/order/export/template', data, filename)
}

// 查询订单详情
export const orderDetail = (data: object) => {
  return request(`${baseUrl}/order/detail`, 'post', data)
}

// 导出扣费记录
export const reductExport = (data: Record<string, any>, filename = '扣费记录.xls') => {
  return exportFile(baseUrl, '/order/export/pay/log', data, filename)
}

// 订购管理-点击记录-列表
export const clickList = (data: object, loading?: boolean) => {
  return request(`${baseUrl}/click/log/list`, 'post', data, loading)
}

// 订购管理-点击记录-导出
export const clickExportList = (data: Record<string, any>, filename = '点击记录.xls') => {
  return exportFile(baseUrl, '/click/log/export/list', data, filename)
}

// 订购管理-点击报价订购记录-审核
export const orderReview = (data: object) => {
  return request(`${baseUrl}/order/review`, 'post', data)
}
// 点击报价订购记录-批量审核
export const orderBatchReview = (data: object) => {
  return request(`${baseUrl}/order/batch_review`, 'post', data)
}
