import { bridge } from '@dz-web/bridge';
import { IUserInfo, oldStyle2Standard } from '@mobile/customize';

/**
 * 中信等app在用的获取用户信息的方法, 新版app请用bridge自带的同名方法
 */
export function getUserConfig() {
  return bridge.sendMsg('getUserConfiguration').then((res: any) => oldStyle2Standard(res));
}

/**
 * 中信等app在用的获取用户信息的方法, 新版app请用bridge自带的同名方法
 */
export function getUserInfo(): Promise<IUserInfo> {
  return bridge.sendMsg('userInfo');
}

/**
 * 通知app登录状态超时
 */
export function sendLoginStatus(params: any) {
  return bridge.sendMsg('loginStatus', params);
}
