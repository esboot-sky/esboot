import { authedAxiosInst, axiosInst } from '@/api/instance';

interface LOGIN_GET_CODE {
  sid: string;
}

// 获取验证码
export function fetchGetCode(data: LOGIN_GET_CODE) {
  return axiosInst.post('/uc/login/getCode', data);
}

interface LOGIN_BY_PWD {
  sid: string;
  imgCode: string;
  username: string;
  password: string;
}

// 登录
export function login(data: LOGIN_BY_PWD) {
  return axiosInst.post('/uc/login/byPwd', data);
}

interface DICT_LANG {
  types: string[];
}

// 获取语言列表 - 不需要token
export function fetchDictLang(data: DICT_LANG) {
  return axiosInst.post('/uc/common/dictLang', data);
}

// 模块列表（多模块）
export function fetchModuleList() {
  return authedAxiosInst.post('/uc/home/moduleList');
}

// 首页登录信息/用户信息
export function fetchSystemLoginInfo() {
  return authedAxiosInst.post('/uc/home/loginInfo');
}

// 修改密码
export function changePasswordApi(data: { password: string; confirmPassword: string }) {
  return authedAxiosInst.post('/uc/my/modifyPwd', data);
}

// 获取外部模块链接
export function getExternalModuleUrl(data: { moduleCode: string }) {
  return authedAxiosInst.post('/uc/user/getModuleUrl', data);
}
