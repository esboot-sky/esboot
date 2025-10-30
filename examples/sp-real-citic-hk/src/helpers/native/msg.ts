import { HeaderButtonOptions, OpenPageParams, PageType } from '@dz-web/bridge/actions/mobile';
import { isObject, isArray } from 'lodash-es';

import { isDev } from '@/constants/config';

import { bridge, actions } from './bridge';

import type { OnEventOptions } from '@dz-web/bridge/actions/mobile';

const {
  _back,
  _openPage,
  _settingHeaderButton,
  _onEvent,
  _offEvent,
  _closePage,
  _emitEvent,
  _getUserInfo,
  _getUserConfig,
  _fullscreen,
  _setPageTitle,
} = actions;
export { type HeaderButtonOptions, type OpenPageParams, PageType };

/**
 * 获取用户信息
 *
 */
export function getUserInfo() {
  return _getUserInfo();
}

/**
 * 获取用户配置
 *
 */
export function getUserConfig() {
  return _getUserConfig();
}

interface BackOptions {
  pageType: PageType;
  path: string;
}

export function back(options?: BackOptions): Promise<any> {
  if (isDev) {
    // window.history.back();
    return Promise.resolve();
  }

  return _back(options);
}

enum UserStatus {
  sessioncode_expired = 'sessioncode_expired', // 登录过期
  not_login = 'not_login', // 未登录
  kick_off = ' kick_off', // 中台踢下线
}

export function changeUserStatus(params: { message: string }) {
  return bridge.sendMsg('USER_STATUS_CHANGE', { userStatus: UserStatus.sessioncode_expired, message: params.message });
}

export enum NativePages {
  LOGIN = 'login', // 登陆页面
  TRADE_LOGIN = 'tradeLogin', // 交易登录
  HOME = 'home', // 首页
  SEARCH = 'search', // 搜索页
  IPO_SUBSCRIPTION = 'ipo-subscription', // 新股认购
  IPO_RECORD = 'ipo-subscription-record', // 新股申购记录
}

export function openPage(params: OpenPageParams): Promise<any> {
  return _openPage(params);
}

export function settingHeaderButton(params: HeaderButtonOptions[]) {
  return _settingHeaderButton(params);
}

export function closePage() {
  if (isDev) {
    window.history.back();
    return Promise.resolve();
  }

  return _closePage();
}

export function call(csList: any): Promise<any> {
  return bridge.sendMsg('NORMAL_CALL', csList);
}

interface INavTitle {
  title: string;
}

// 设置导航栏名称
export function settingNavigationTitle(params: INavTitle) {
  if (isDev) {
    document.title = params.title;
    return Promise.resolve();
  }

  return _setPageTitle(params.title);
}

export function getStorage(params: { key: string }): Promise<any> {
  const data = localStorage.getItem(params.key);
  if (data) {
    try {
      return Promise.resolve({ data: JSON.parse(data), errorCode: 0 });
    } catch (error) {
      return Promise.resolve({ data, errorCode: 0 });
    }
  }
  return Promise.resolve({ data, errorCode: 1 });
}

export function setStorage(params: { key: string; value: any }): Promise<any> {
  if (isObject(params.value) || isArray(params.value)) {
    localStorage.setItem(params.key, JSON.stringify(params.value));
  } else {
    localStorage.setItem(params.key, params.value);
  }
  return Promise.resolve();
}

export function removeStorage(params: { key: string }): Promise<any> {
  localStorage.removeItem(params.key);
  return Promise.resolve();
}

export function onEvent<T>(options: OnEventOptions, callback: (data: T) => void = () => {}) {
  return _onEvent<T>(options, callback);
}

export function offEvent(event: string, id: string) {
  return _offEvent(event, id);
}

export function emitEvent(event: string, data: any) {
  return _emitEvent(event, data);
}

export function fullscreen() {
  return _fullscreen();
}
