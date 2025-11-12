import { exportFile } from '@/utils'
import { BASE_URL } from '@/utils/request/config'
import request from '@/utils/request/request'

// 客户列表
export const getCustomerInfoList = (data?: object, loading?: boolean) => {
  return request('/uc/customer/info/list', 'post', data, loading)
}
// 客户列表-禁用
export const customerForbid = (data?: object, loading?: boolean) => {
  return request('/uc/customer/info/disable', 'post', data, loading)
}
// 客户列表-启用
export const customerStartup = (data?: object, loading?: boolean) => {
  return request('/uc/customer/info/enable', 'post', data, loading)
}
// 客户列表-新增客户
export const newCustomerApi = (data?: object, loading?: boolean) => {
  return request('/uc/customer/info/add', 'post', data, loading)
}
// 客户列表-下载模板
export const downloadTemplateApi = (data?: object, loading?: boolean) => {
  return request('/uc/customer/info/downloadTemplate', 'get', data, loading, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob',
  })
}
// 客户列表-批量启用
export const customerBatchStartup = (data?: object, loading?: boolean) => {
  return request('/uc/customer/info/enableBatch', 'post', data, loading)
}
// 客户列表-批量启用
export const customerBatchForbid = (data?: object, loading?: boolean) => {
  return request('/uc/customer/info/disableBatch', 'post', data, loading)
}
// 客户列表-导出
export const customerExport = (data?: object, loading?: boolean) => {
  return request('/uc/customer/info/export', 'get', data, loading, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob',
  })
}
// 修改认证手机（发送短信）
export const modifyMobileSendSms = (data?: object, loading?: boolean) => {
  return request('/uc/customer/info/modifyMobileSendSms', 'post', data, loading)
}
// 修改认证手机 -- 确认
export const modifyCertifiedMobile = (data?: object, loading?: boolean) => {
  return request('/uc/customer/info/modifyMobile', 'post', data, loading)
}
// 客户列表-客户修改
export const modifyCustomerApi = (data?: object, loading?: boolean) => {
  return request('/uc/customer/info/modify', 'post', data, loading)
}
// 客户列表-重置密码
export const customerResetPass = (data?: object, loading?: boolean) => {
  return request('/uc/customer/info/resetPwd', 'post', data, loading)
}
// 行情账号 - 详情
export const showMarketAccountDetails = (data?: object, loading?: boolean) => {
  return request('/uc/customer/info/quotation/detail', 'post', data, loading)
}
// 客户列表-绑定交易账号
export const bindingTransactionAccount = (data?: object, loading?: boolean) => {
  return request('/uc/customer/info/trade/bind', 'post', data, loading)
}
// 客户列表-交易账号详情
export const getTransactionAccountDetail = (data?: object, loading?: boolean) => {
  return request('/uc/customer/info/trade/details', 'post', data, loading)
}
// 客户列表-交易账号详情-解绑
export const unbindTransactionAccount = (data?: object, loading?: boolean) => {
  return request('/uc/customer/info/trade/unbind', 'post', data, loading)
}

// 登录日志-列表
export const getCustomerLoginLogList = (data?: object, loading?: boolean) => {
  return request('/uc/customer/loginLog/list', 'post', data, loading)
}
// 登录日志-导出
export const LoginLogExport = (data?: object, loading?: boolean) => {
  return request('/uc/customer/loginLog/export', 'get', data, loading, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob',
  })
}

// 用户管理-列表
export const getUserManagementList = (data?: object, loading?: boolean) => {
  return request('/uc/user/info/list', 'post', data, loading)
}
// 用户管理-批量删除
export const userBatchDelete = (data?: object, loading?: boolean) => {
  return request('/uc/user/info/deleteBatch', 'post', data, loading)
}
// 用户管理-批量启用
export const userBatchStartup = (data?: object, loading?: boolean) => {
  return request('/uc/user/info/enableBatch', 'post', data, loading)
}
// 用户管理-批量禁用
export const userBatchForbid = (data?: object, loading?: boolean) => {
  return request('/uc/user/info/disableBatch', 'post', data, loading)
}
// 用户管理-删除
export const userDelete = (data?: object, loading?: boolean) => {
  return request('/uc/user/info/delete', 'post', data, loading)
}
// 用户管理-启用
export const userStartup = (data?: object, loading?: boolean) => {
  return request('/uc/user/info/enable', 'post', data, loading)
}
// 用户管理-禁用
export const userForbid = (data?: object, loading?: boolean) => {
  return request('/uc/user/info/disable', 'post', data, loading)
}
// 用户管理-重置密码
export const userResetPass = (data?: object, loading?: boolean) => {
  return request('/uc/user/info/resetPwd', 'post', data, loading)
}
// 用户管理-分配角色 -- 列表
export const getUserAssignRoles = (data?: object, loading?: boolean) => {
  return request('/uc/user/info/roleList', 'post', data, loading)
}
// 用户管理-所属角色
export const getUserManagementRoleList = (data?: object, loading?: boolean) => {
  return request('/uc/common/roleList', 'post', data, loading)
}
// 用户管理-部门列表（所属部门）
export const getUserDeptList = (data?: object, loading?: boolean) => {
  return request('/uc/common/deptList', 'post', data, loading)
}
// 用户管理-添加用户
export const newUserApi = (data?: object, loading?: boolean) => {
  return request('/uc/user/info/add', 'post', data, loading)
}
// 用户管理-用户修改
export const modifyUserApi = (data?: object, loading?: boolean) => {
  return request('/uc/user/info/modify', 'post', data, loading)
}
// 用户管理-分配角色 -- 确认
export const roleAssignConfirm = (data?: object, loading?: boolean) => {
  return request('/uc/user/info/roleAssign', 'post', data, loading)
}
// 用户管理-分配角色 -- 确认（批量）
export const batchRolesAssignConfirm = (data?: object, loading?: boolean) => {
  return request('/uc/user/info/roleAssignBatch', 'post', data, loading)
}

// 角色管理-列表
export const getUserRoleList = (data?: object, loading?: boolean) => {
  return request('/uc/role/info/list', 'post', data, loading)
}
// 角色管理-删除
export const deleteRole = (data?: object, loading?: boolean) => {
  return request('/uc/role/info/delete', 'post', data, loading)
}
// 角色管理-批量删除
export const batchDeleteRole = (data?: object, loading?: boolean) => {
  return request('/uc/role/info/deleteBatch', 'post', data, loading)
}
// 角色管理-分配权限 - 权限列表
export const getRolePermissions = (moduleCode: string, data?: object, loading?: boolean) => {
  return request('/uc/role/info/permission/list', 'post', data, loading, {
    headers: { moduleCode },
  })
}
// 角色管理-新增
export const newRolesApi = (data?: object, loading?: boolean) => {
  return request('/uc/role/info/add', 'post', data, loading)
}
// 角色管理-修改
export const editRolesApi = (data?: object, loading?: boolean) => {
  return request('/uc/role/info/modify', 'post', data, loading)
}
// 角色管理-分配权限 - 权限修改
export const modifyPermissions = (data?: object, loading?: boolean) => {
  return request('/uc/role/info/permission/modify', 'post', data, loading)
}

// 操作日志-列表
export const getUserOperationLog = (data?: object, loading?: boolean) => {
  return request('/uc/operationLog/list', 'post', data, loading)
}

// 操作日志-导出
export const operationLogExport = (data: Record<string, any> = {}, filename = '登录日志.xlsx') => {
  return exportFile(BASE_URL, 'uc/operationLog/export', data, filename)
}

// 登录日志-列表
export const getUserLoginLog = (data?: object, loading?: boolean) => {
  return request('/uc/login/log/list', 'post', data, loading)
}
// 登录日志-导出
export const loginLogExport = (data?: object, loading?: boolean) => {
  return request('/uc/login/log/export', 'get', data, loading, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob',
  })
}

// 部门管理-列表
export const getDepartmentList = (data?: object, loading?: boolean) => {
  return request('/uc/dept/info/list', 'post', data, loading)
}
// 部门管理-新增
export const newDepartment = (data?: object, loading?: boolean) => {
  return request('/uc/dept/info/add', 'post', data, loading)
}
// 部门管理-修改
export const editDepartment = (data?: object, loading?: boolean) => {
  return request('/uc/dept/info/modify', 'post', data, loading)
}
// 部门管理-删除
export const deleteDepartment = (data?: object, loading?: boolean) => {
  return request('/uc/dept/info/delete', 'post', data, loading)
}

// 文件导入日志-列表
export const getFileImportLogList = (data?: object, loading?: boolean) => {
  return request('/quotation/admin/excel/importLog/list', 'post', data, loading)
}

// 文件导入日志-下载
export const fileImportLogExport = (data?: object, loading?: boolean) => {
  return request('/quotation/excel/importLog/downloadLog', 'get', data, loading, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob',
  })
}

// 检查登录账号是否可用
export const checkUsernameApi = (data?: object, loading?: boolean) => {
  return request('/uc/user/info/checkUsername', 'post', data, loading)
}

// 模块列表（多模块）
export const getModulesByRole = (data?: object, loading?: boolean) => {
  return request('/uc/role/info/permission/modules', 'post', data, loading)
}

// 部门管理-获取部门编码
export const getDepartmentCode = (data?: object, loading?: boolean) => {
  return request('/uc/dept/info/code', 'post', data, loading)
}
