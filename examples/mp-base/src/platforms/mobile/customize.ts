import { Language } from '@/constants/config';
import { listenReactQueryError } from '@/global-events';
import { ThemeValues, RaiseMode, TOKEN_KEY } from '@mobile/constants/config';
import { IStandardAppUserConfig } from '@mobile/model/app/slice';

/**
 * app传过来的原始设置信息, 代码中不使用此类型，使用dz web app标准类型IStandardAppUserConfig
 */
export interface IRawAppUserConfig {
  theme: ThemeValues;
  deviceNo: string;
  language: Language;
  orderToConfirmByDialog: boolean;
  raise: RaiseMode;
  global_font_scale: number;
}

/**
 * 转换原始app用户配置为标准app用户配置
 */
export function oldStyle2Standard(rawAppUserConfig: IRawAppUserConfig) {
  const { theme, language, raise, deviceNo } = rawAppUserConfig;

  const standardUserConfig: IStandardAppUserConfig = {
    deviceNo,
    theme,
    language,
    // app端不需要跟随系统颜色设置，因为app端有自己的颜色设置，变化了会通知webview页面
    followSystemPrefersColorSchemeWhenInBrowser: false,
    raw: rawAppUserConfig,
    raise,
  };

  console.log('AppUserConfig(dz标准app用户配置): ', standardUserConfig);
  return standardUserConfig;
}

/**
 * 不同的app user info不可能统一格式
 * 在这里根据app提供的内容，改成自己的格式即可
 */
export interface IUserInfo {
  sessionCode: string;
  bcanStatus: string;
  bindTrade: boolean;
  isLogin: boolean;
  mobile: string;
  nickName: string;
  orgCode: string;
  sessionId: string;
  trade2faCode: string;
  tradeToken: string;
  tradingAccSeq: string;
  userId: string;
}

/**
 * 根据项目提供的用户信息，返回access token
 */
export function accessToken(userInfo: IUserInfo) {
  return userInfo[TOKEN_KEY];
}

// 监听react query错误
listenReactQueryError((friendlyMessage, error, meta) => {
  console.error('还未添加全局错误提示', friendlyMessage, error, meta);
});

// TODO: 监听请求失败错误, 通常不统一报错，而是在各个页面自己处理，否则有错误定制需求的页面会重复报错
// 或者使用react query管理请求，重试请求失败后，会统一处理报错，并且可以通过meta抑制错误提示
