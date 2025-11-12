import request from '@/utils/request/request'
import { baseUrl } from '.'
import axios from 'axios'
import store from '@/store'
// 套餐列表
export const quoList = (data: object) => {
  return request(`${baseUrl}/package/default/list`, 'post', data)
}
// 套餐详情
export const quoDetailt = (data: object) => {
  return request(`${baseUrl}/package/detail`, 'post', data)
}
// 删除套餐
export const deleteReq = (data: object) => {
  return request(`${baseUrl}/package/default/delete`, 'post', data)
}

// 启用/禁用套餐
export const enableReq = (data: object) => {
  return request(`${baseUrl}/package/default/enable`, 'post', data)
}

// 新增套餐
export const quoSave = (data: object) => {
  return request(`${baseUrl}/package/default/save`, 'post', data)
}

// 修改套餐
export const quoUpdate = (data: object) => {
  return request(`${baseUrl}/package/default/update`, 'post', data)
}

// 审核套餐
export const quoReview = (data: object) => {
  return request(`${baseUrl}/package/default/review`, 'post', data)
}

//选择套餐
export const selectQuoList = (data: object) => {
  return request(`${baseUrl}/package/list`, 'post', data)
}

//用户身份
export const useCard = (data: object) => {
  return request(`${baseUrl}/admin/common/dictList`, 'post', data)
}
