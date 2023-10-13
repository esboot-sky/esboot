import { MinimalStoreType } from '@mobile/model/minimal-store';
import { accessToken } from '@mobile/customize';
import { supportedLanguage } from '@/constants/config';

export function getPlatformIndependentUserConfig() {
  if (process.env.isMobile) {
    const store = (window as any).__mobile_store__ as MinimalStoreType;
    const { app: { userConfig, userInfo } } = store.getState();
    const { language } = userConfig;
    const token = accessToken(userInfo);

    return {
      language,
      token,
    };
  }

  return {
    language: supportedLanguage.ZH_CN,
    token: '',
  };
}
