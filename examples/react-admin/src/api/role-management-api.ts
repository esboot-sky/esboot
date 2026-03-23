import { authedAxiosInst } from './instance';
import { IJavaBaseResponse } from './instance';
import { IdPayload, IdsPayload, PaginationQuery, PagedResult } from './types';

type RoleListItem = {
  id: number;
  createTime: string;
  name: string;
  parentName: string;
  remark: string;
  parentId: number;
};

type RoleListQuery = PaginationQuery & {
  keyword?: string;
  parentId?: number;
};

type RoleUpsertPayload = Record<string, unknown>;

type ModuleInfo = {
  name: string;
  code: string;
};

type PermissionListResult = {
  permissions: Record<string, unknown>[];
  checkedList: number[];
};

export const queryRoleInfoList = (data: RoleListQuery): Promise<IJavaBaseResponse<PagedResult<RoleListItem>>> => {
  return authedAxiosInst.post('/uc/role/info/list', data);
};

export const queryRoleInfoAdd = (data: RoleUpsertPayload): Promise<IJavaBaseResponse<null>> => {
  return authedAxiosInst.post('/uc/role/info/add', data);
};

export const queryPermissionModules = (data: IdPayload): Promise<IJavaBaseResponse<ModuleInfo[]>> => {
  return authedAxiosInst.post('/uc/role/info/permission/modules', data);
};

export const queryPermissionList = (
  data: IdPayload & { parentId: number },
  moduleCode: string,
): Promise<IJavaBaseResponse<PermissionListResult>> => {
  return authedAxiosInst.post('/uc/role/info/permission/list', data, { headers: { moduleCode } });
};

export const queryPermissionModify = (
  data: { id: number; modules: Record<string, unknown>[] },
  moduleCode: string,
): Promise<IJavaBaseResponse<null>> => {
  return authedAxiosInst.post('/uc/role/info/permission/modify', data, { headers: { moduleCode } });
};

export const queryRoleInfoModify = (data: RoleUpsertPayload): Promise<IJavaBaseResponse<null>> => {
  return authedAxiosInst.post('/uc/role/info/modify', data);
};

export const queryDeleteRole = (data: IdPayload): Promise<IJavaBaseResponse<null>> => {
  return authedAxiosInst.post('/uc/role/info/delete', data);
};

export const queryBatchDeleteRole = (data: IdsPayload): Promise<IJavaBaseResponse<null>> => {
  return authedAxiosInst.post('/uc/role/info/deleteBatch', data);
};
