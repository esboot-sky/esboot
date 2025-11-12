import request from '@/utils/request/request'
import { baseUrl } from '.'
import { exportFile } from '@/utils'

// 套餐分配列表
export const separateList = (data: object) => {
  return request(`${baseUrl}/package/default/use/log/list`, 'post', data)
}

//导出
export const exportQue = (data: Record<string, any>) => {
  return exportFile(baseUrl, '/package/default/export/use/log/list', data, '套餐分配列表.xls')
}

// 产品列表
export const productList = () => {
  const data = {
    // types: ['002'],
    packageType:2,
  }
  // return request(`${baseUrl}/package/list/click`, 'post', data)
  return request(`${baseUrl}/product/list`, 'post', data)
}
// 串流行情套餐统计导出模板
export const sendForCountExport = (data: Record<string, any>, filename = '批量导出模板.xls') => {
  return exportFile(baseUrl, '/statistics/export/quo', data, filename)
}