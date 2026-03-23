import { authedAxiosInst } from './instance';
import { IJavaBaseResponse } from './instance';
import { IdPayload, IdsPayload, PaginationQuery, PagedResult } from './types';

type UserListItem = {
  id: number;
  createTime: string;
  username: string;
  nickname: string;
  mobile: string;
  roleName: string;
  deptName: string;
  email: string;
  lastLoginIp: string;
  updateTime: string;
  status: number;
};

type UserListQuery = PaginationQuery & {
  keyword?: string;
  roleId?: number;
};

type CheckUsernamePayload = {
  username: string;
};

type UserUpsertPayload = Record<string, unknown>;

type RoleAssignPayload = IdPayload & {
  roleIds: number[];
};

type RoleAssignBatchPayload = IdsPayload & {
  roleIds: number[];
};

type ResetPwdPayload = IdPayload & {
  password: string;
};

export const queryUserInfoList = (data: UserListQuery): Promise<IJavaBaseResponse<PagedResult<UserListItem>>> => {
  return authedAxiosInst.post('/uc/user/info/list', data);
};

export const queryCheckUsername = (data: CheckUsernamePayload): Promise<IJavaBaseResponse<null>> => {
  return authedAxiosInst.post('/uc/user/info/checkUsername', data);
};

export const queryAddUser = (data: UserUpsertPayload): Promise<IJavaBaseResponse<null>> => {
  return authedAxiosInst.post('/uc/user/info/add', data);
};

export const queryModifyUser = (data: UserUpsertPayload): Promise<IJavaBaseResponse<null>> => {
  return authedAxiosInst.post('/uc/user/info/modify', data);
};

export const queryUserDelete = (data: IdPayload): Promise<IJavaBaseResponse<null>> => {
  return authedAxiosInst.post('/uc/user/info/delete', data);
};

export const queryUserEnable = (data: IdPayload): Promise<IJavaBaseResponse<null>> => {
  return authedAxiosInst.post('/uc/user/info/enable', data);
};

export const queryUserDisable = (data: IdPayload): Promise<IJavaBaseResponse<null>> => {
  return authedAxiosInst.post('/uc/user/info/disable', data);
};

export const queryRoleAssign = (data: RoleAssignPayload): Promise<IJavaBaseResponse<null>> => {
  return authedAxiosInst.post('/uc/user/info/roleAssign', data);
};

export const queryResetPwd = (data: ResetPwdPayload): Promise<IJavaBaseResponse<null>> => {
  return authedAxiosInst.post('/uc/user/info/resetPwd', data);
};

export const queryDeleteBatch = (data: IdsPayload): Promise<IJavaBaseResponse<null>> => {
  return authedAxiosInst.post('/uc/user/info/deleteBatch', data);
};

export const queryEnableBatch = (data: IdsPayload): Promise<IJavaBaseResponse<null>> => {
  return authedAxiosInst.post('/uc/user/info/enableBatch', data);
};

export const queryDisableBatch = (data: IdsPayload): Promise<IJavaBaseResponse<null>> => {
  return authedAxiosInst.post('/uc/user/info/disableBatch', data);
};

export const queryRoleAssignBatch = (data: RoleAssignBatchPayload): Promise<IJavaBaseResponse<null>> => {
  return authedAxiosInst.post('/uc/user/info/roleAssignBatch', data);
};
