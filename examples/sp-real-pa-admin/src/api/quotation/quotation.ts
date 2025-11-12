import axios from 'axios'
import store from '@/store'
import request from '@/utils/request/request'
import { baseUrl } from '.'
import { exportFile } from '@/utils'

// 套餐管理-串流行情套餐-套餐列表
export const quoList = (data: object) => {
  return request(`${baseUrl}/package/list/quo`, 'post', data)
}
// 套餐管理-点击报价套餐-套餐列表
export const quoListClick = (data: object) => {
  return request(`${baseUrl}/package/list/click`, 'post', data)
}

// 删除套餐
export const deleteReq = (data: object) => {
  return request(`${baseUrl}/package/delete`, 'post', data)
}

// 启用/禁用套餐
export const enableReq = (data: object) => {
  return request(`${baseUrl}/package/enable`, 'post', data)
}

// 套餐管理-新增串流行情套餐-新增套餐
export const quoSave = (data: object) => {
  return request(`${baseUrl}/package/save/quo`, 'post', data)
}
// 套餐管理-新增点击报价套餐-新增套餐
export const quoClick = (data: object) => {
  return request(`${baseUrl}/package/save/click`, 'post', data)
}

// 套餐管理-新增串流行情套餐-修改套餐
export const quoUpdate = (data: object) => {
  return request(`${baseUrl}/package/update/quo`, 'post', data)
}
// 套餐管理-新增点击报价套餐-修改套餐
export const quoUpdateClick = (data: object) => {
  return request(`${baseUrl}/package/update/click`, 'post', data)
}

// 审核套餐
export const quoReview = (data: object) => {
  return request(`${baseUrl}/package/review`, 'post', data)
}

// 订购记录-审核订单
export const review = (data: object) => {
  return request(`${baseUrl}/order/review`, 'post', data)
}

// 订购记录-新增订购
export const save = (data: object) => {
  return request(`${baseUrl}/order/save`, 'post', data)
}

// 查询客户条件[下拉框]
export const searchCondition = (data: object) => {
  return request(`${baseUrl}/cus/condition`, 'post', data)
}

// 套餐详情
export const getPackageInfo = (data: object) => {
  return request(`${baseUrl}/package/detail`, 'post', data)
}

export const uploadFile = (data: object, url = '/order/import') => {
  const a = axios.create({
    baseURL: baseUrl,
    timeout: 15000,
    withCredentials: true,
  })

  return a.post(`${baseUrl}${url}`, data, {
    headers: {
      'content-type': 'multipart/form-data',
      token: store.state.token,
    },
  })
}

// 验证订单
export const verifyOrder = (data: object) => {
  return request(`${baseUrl}/order/verify`, 'post', data)
}

// 产品列表
export const productList = () => {
  const data = {
    types: ['001'],
  }
  // return request(`${baseUrl}/package/list/click`, 'post', data)
  return request(`${baseUrl}/product/list`, 'post', data)
}
// 串流行情套餐统计导出模板
export const sendForCountExport = (data: Record<string, any>, filename = '批量导出模板.xls') => {
  return exportFile(baseUrl, '/statistics/export/quo', data, filename)
}

/**
 * 上传文件接口
 * @returns
 */
export const uploadFileSys = (data: FormData) => {
  return axios.post(`${baseUrl}/sys/file/upload/1`, data, {
    headers: {
      token: store.state.token,
    },
  })
}

/**
 * 批量上传文件接口
 * @returns
 */
export const uploadFiles = (data: FormData) => {
  return axios.post(`${baseUrl}/sys/file/uploadBatch/uploadFiles`, data, {
    headers: {
      token: store.state.token,
    },
  })
}
