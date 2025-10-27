import browser from 'browser-detect';

import { postRequestAPI } from '../api';

const detectResult = browser();

export interface ITradeLoginRequest {
  clientId: string;
  password: string;
}

export interface ITradeLoginResponse {
  account: string; // 交易帐户
  accountType: string; // 帐户类型, C: 现金， M保证金
  token: string; // 交易token
  loginStatus: 'N' | 'S' | 'E'; // N: 不需要， S: 短信登录， E: 邮箱登录
  trade2faCode: string; // 交易2faCode, 用于发送验证码
  sessionId: string; // 用于请求免密登录接口用的参数
  bcanStatus?: string; // Y同意，N取消，Z代表没有签署前端需要弹窗提示
  bcanMarket?: string; // 市场编号[HKEX,SHMK,SZMK,USA,FUND]
}

/**
 * 用户密码，交易登录
 */
export function tradeLogin(data: ITradeLoginRequest) {
  const channelType = 'WEB'; // WEB, PC, IOS, ANDROID
  const { name: browserName, version: browserVersion, os } = detectResult;
  return postRequestAPI<ITradeLoginResponse>(
    '2101',
    {
      ...data,
      versionInfo: {
        channelType,
        appVersion: '1.0.0',
        deviceNo: `zxjth5`,
        deviceVersion: `${browserName} ${browserVersion}`,
        systemVersion: os,
      },
    },
    false,
  );
}

export interface IChangePasswordRequest {
  type: 1 | 2; // 1: 登录密码， 2: 交易密码
  oldPassword: string;
  newPassword: string;
}

/**
 * 用旧密码修改密码
 */
export function changePassword(data: IChangePasswordRequest) {
  return postRequestAPI('2104', data);
}

export interface ISend2faCodeRequest {
  sendType: 'S' | 'E'; // S: 短信， E: 邮箱
  trade2faCode: string; // 交易2faCode, 用于发送验证码
}

/**
 * 发送2fa验证码
 */
export function send2faCode(data: ISend2faCodeRequest) {
  return postRequestAPI('2102', data, false);
}

export interface ILoginBy2faCodeRequest {
  /**
   * 验证码
   */
  code: string;
  /**
   * 交易2faCode, 用于标识2fa用户, 用于发送验证码、登录
   */
  trade2faCode: string;
}

/**
 * 用2fa验证码登录
 */
export function loginBy2faCode(data: ILoginBy2faCodeRequest) {
  return postRequestAPI<ITradeLoginResponse>('2103', data, false);
}
