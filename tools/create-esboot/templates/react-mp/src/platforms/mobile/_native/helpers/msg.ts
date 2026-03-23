import type { StandardUserConfig } from '@mobile/model/mobile';
import type { OriginalUserConfig, OriginalUserInfo } from '@/platforms/mobile/helpers/customize';

import { _changeUserStatus, _getUserConfig, _getUserInfo } from '@dz-web/bridge/actions/mobile';
import { oldStyle2Standard } from '@/platforms/mobile/helpers/customize';

/**
 * 中信等app在用的获取用户信息的方法, 新版app请用bridge自带的同名方法
 */
export function getUserConfig(): Promise<StandardUserConfig> {
  return _getUserConfig<OriginalUserConfig>().then((res: OriginalUserConfig) => oldStyle2Standard(res));
}

/**
 * 中信等app在用的获取用户信息的方法, 新版app请用bridge自带的同名方法
 */
export function getUserInfo(): Promise<OriginalUserInfo> {
  return _getUserInfo<OriginalUserInfo>();
}

/**
 * 通知app登录状态超时
 */
export function sendLoginStatus(params: any) {
  return _changeUserStatus(params);
}
