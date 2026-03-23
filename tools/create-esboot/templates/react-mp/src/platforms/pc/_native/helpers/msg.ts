import type { UserInfo } from '@pc/types';

import { bridge } from '@dz-web/bridge';

import { oldStyle2Standard } from '@pc/helpers/customize';

/**
 * 中信等app在用的获取用户信息的方法, 新版app请用bridge自带的同名方法
 */
export function getUserConfig() {
  return bridge.sendMsg('getUserConfiguration').then((res: any) => oldStyle2Standard(res));
}

/**
 * 中信等app在用的获取用户信息的方法, 新版app请用bridge自带的同名方法
 */
export function getUserInfo(): Promise<UserInfo> {
  return bridge.sendMsg('userInfo');
}

/**
 * 通知app登录状态超时
 */
export function sendLoginStatus(params: any) {
  return bridge.sendMsg('loginStatus', params);
}
