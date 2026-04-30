import { authedAxiosInst, axiosInst } from '@/api/instance';

interface LOGIN_GET_CODE {
  sid: string;
}

// 获取验证码
export const fetchGetCode = (data: LOGIN_GET_CODE) => {
  return axiosInst.post('/uc/login/getCode', data);
};

interface LOGIN_BY_PWD {
  sid: string;
  imgCode: string;
  username: string;
  password: string;
}

// 登录
export const login = (data: LOGIN_BY_PWD) => {
  return axiosInst.post('/uc/login/byPwd', data);
};

interface DICT_LANG {
  types: string[];
}

// 获取语言列表 - 不需要token
export const fetchDictLang = (data: DICT_LANG) => {
  return axiosInst.post('/uc/common/dictLang', data);
};

// 模块列表（多模块）
export const fetchModuleList = () => {
  return authedAxiosInst.post('/uc/home/moduleList');
};
