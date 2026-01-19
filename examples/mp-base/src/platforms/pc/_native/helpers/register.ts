import type { UserInfo } from '@pc/types';

import { bridge } from '@dz-web/bridge';

import { oldStyle2Standard } from '@pc/helpers/customize';

/**
 * 换肤等配置信息变化
 *
 */
export function onUpdateUserConfig(handle: (data: any) => void) {
  return bridge.register('updateUserConfig', (res: any) => handle(oldStyle2Standard(res)));
}

/**
 * 用户账户信息变化
 *
 */
export function onUpdateUserInfo(handle: (data: UserInfo) => void) {
  return bridge.register('updateUserInfo', handle);
}
