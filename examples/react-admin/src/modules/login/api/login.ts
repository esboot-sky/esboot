import { authedAxiosInst, axiosInst } from '@/api/instance';

interface LOGIN_GET_CODE {
  sid: string;
}

export const queryGetCode = (data: LOGIN_GET_CODE) => {
  return axiosInst.post('/uc/login/getCode', data);
};

interface LOGIN_BY_PWD {
  sid: string;
  imgCode: string;
  username: string;
  password: string;
}

export const login = (data: LOGIN_BY_PWD) => {
  return axiosInst.post('/uc/login/byPwd', data);
};

interface DICT_LANG {
  types: string[];
}

export const queryDictLang = (data: DICT_LANG) => {
  return axiosInst.post('/uc/common/dictLang', data);
};

export const queryModuleList = () => {
  return authedAxiosInst.post('/uc/home/moduleList');
};
