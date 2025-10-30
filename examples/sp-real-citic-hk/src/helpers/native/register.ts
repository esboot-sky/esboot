import { bridge, actions } from '@/helpers/native/bridge';

const { _onPageHide, _onPageShow } = actions;

/**
 * 更新用户信息
 *
 */
export function updateUserInfo(func: any): void {
  bridge.register('updateUserInfo', func);
}

/**
 * 用户更新配置
 *
 */
export function updateUserConfig(func: any): void {
  bridge.register('updateUserConfiguration', func);
}

export function onPageShow(func: any): void {
  _onPageShow(func);
}

export function onPageHide(func: any): void {
  _onPageHide(func);
}
