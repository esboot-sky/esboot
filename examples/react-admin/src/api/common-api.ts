import { authedAxiosInst } from './instance';

export const queryRoleList = (data: Record<string, unknown>) => {
  return authedAxiosInst.post('/uc/common/roleList', data);
};

export const queryUserDeptList = (data: object) => {
  return authedAxiosInst.post('/uc/common/deptList', data);
};
