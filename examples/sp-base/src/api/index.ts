import { axiosInst } from '@/api/instance';

const base = '/api';

export const login = (data: any) => {
  return axiosInst.post(`${base}/usercenter/home/login`, data);
};
