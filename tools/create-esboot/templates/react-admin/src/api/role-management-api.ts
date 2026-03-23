import type { IJavaBaseResponse } from './instance';
import type { IdPayload, IdsPayload, PagedResult, PaginationQuery } from './types';
import { authedAxiosInst } from './instance';

interface RoleListItem {
  id: number;
  createTime: string;
  name: string;
  parentName: string;
  remark: string;
  parentId: number;
}

type RoleListQuery = PaginationQuery & {
  keyword?: string;
  parentId?: number;
};

type RoleUpsertPayload = Record<string, unknown>;

interface ModuleInfo {
  name: string;
  code: string;
}

interface PermissionListResult {
  permissions: Record<string, unknown>[];
  checkedList: number[];
}

export function queryRoleInfoList(data: RoleListQuery): Promise<IJavaBaseResponse<PagedResult<RoleListItem>>> {
  return authedAxiosInst.post('/uc/role/info/list', data);
}

export function queryRoleInfoAdd(data: RoleUpsertPayload): Promise<IJavaBaseResponse<null>> {
  return authedAxiosInst.post('/uc/role/info/add', data);
}

export function queryPermissionModules(data: IdPayload): Promise<IJavaBaseResponse<ModuleInfo[]>> {
  return authedAxiosInst.post('/uc/role/info/permission/modules', data);
}

export function queryPermissionList(
  data: IdPayload & { parentId: number },
  moduleCode: string,
): Promise<IJavaBaseResponse<PermissionListResult>> {
  return authedAxiosInst.post('/uc/role/info/permission/list', data, { headers: { moduleCode } });
}

export function queryPermissionModify(
  data: { id: number; modules: Record<string, unknown>[] },
  moduleCode: string,
): Promise<IJavaBaseResponse<null>> {
  return authedAxiosInst.post('/uc/role/info/permission/modify', data, { headers: { moduleCode } });
}

export function queryRoleInfoModify(data: RoleUpsertPayload): Promise<IJavaBaseResponse<null>> {
  return authedAxiosInst.post('/uc/role/info/modify', data);
}

export function queryDeleteRole(data: IdPayload): Promise<IJavaBaseResponse<null>> {
  return authedAxiosInst.post('/uc/role/info/delete', data);
}

export function queryBatchDeleteRole(data: IdsPayload): Promise<IJavaBaseResponse<null>> {
  return authedAxiosInst.post('/uc/role/info/deleteBatch', data);
}
