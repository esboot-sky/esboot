import { authedAxiosInst } from './instance';

export function queryRoleList(data: Record<string, unknown>) {
  return authedAxiosInst.post('/uc/common/roleList', data);
}

export function queryUserDeptList(data: object) {
  return authedAxiosInst.post('/uc/common/deptList', data);
}
