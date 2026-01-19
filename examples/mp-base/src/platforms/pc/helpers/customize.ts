import type { QuotesUpDownColor, ThemeValues } from '@pc/constants/config';
import type { UserInfo } from '@pc/types';
import type { Language } from '@/constants/config';
import type { StandardUserConfig } from '@/platforms/pc/model/pc';
// import { getRealPCNativeFontSize } from '@pc-native/utils/pc-native-config';
import { TOKEN_KEY } from '@pc/constants/config';

/**
 * pc传过来的原始设置信息, 代码中不使用此类型，使用dz web app标准类型RawPCUserConfig
 */
export interface RawPCUserConfig {
  font: {
    additionalSize: number;
    list: number[];
    weight: 'normal' | 'bold';
  };
  theme: ThemeValues;
  language: Language;
  raise: QuotesUpDownColor;
}

/**
 * 根据项目提供的用户信息，返回access token
 */
export function accessToken(userInfo: UserInfo) {
  return userInfo[TOKEN_KEY];
}

/**
 * 转换原始app用户配置为标准app用户配置
 */
export function oldStyle2Standard(userConfig: RawPCUserConfig) {
  const { theme, language, raise, font } = userConfig;

  const standardUserConfig: StandardUserConfig = {
    theme,
    language,
    // app端不需要跟随系统颜色设置，因为app端有自己的颜色设置，变化了会通知webview页面
    followSystemPrefersColorSchemeWhenInBrowser: false,
    raw: userConfig,
    quotesUpDownColor: raise,
    appFontSize: 16,
    // appFontSize: getRealPCNativeFontSize(font.additionalSize.toString()),
    appFontWeight: font.weight,
    deviceNo: '',
  };

  console.log('AppUserConfig(dz标准pc用户配置): ', standardUserConfig);
  return standardUserConfig;
}
