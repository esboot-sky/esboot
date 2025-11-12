import request from '@/utils/request/request'
import { baseUrl } from '.'

// 套餐列表
export const rulesList = (data: object) => {
  return request(`${baseUrl}/order/change/rule/list`, 'post', data)
}

//新增
export const saveList = (data: object) => {
  return request(`${baseUrl}/order/change/save`, 'post', data)
}
//修改
export const updateList = (data: object) => {
  return request(`${baseUrl}/order/change/update`, 'post', data)
}
//删除
export const deleteList = (data: object) => {
  return request(`${baseUrl}/order/change/delete`, 'post', data)
}
//启用/禁用
export const enableList = (data: object) => {
  return request(`${baseUrl}/order/change/enable`, 'post', data)
}
