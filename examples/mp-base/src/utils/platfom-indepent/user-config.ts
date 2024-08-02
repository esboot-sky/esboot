import { TOKEN_KEY } from '@mobile/constants/config';
import { TOKEN_KEY as PC_TOKEN_KEY } from '@pc/constants/config';

import type { MinimalStoreType } from '@mobile/model/minimal-store';
import type { MinimalStoreType as PCMinimalStoreType } from '@pc/model/minimal-store';

export function getPlatformIndependentUserConfig() {
  if (process.env.isMobile) {
    const store = (window as any).__mobile_store__ as MinimalStoreType;
    const {
      app: { userConfig, userInfo },
    } = store.getState();
    const { language } = userConfig;
    const token = userInfo[TOKEN_KEY];

    return {
      language,
      token,
    };
  }

  const store = (window as any).__mobile_store__ as PCMinimalStoreType;
  const {
    app: { userConfig, userInfo },
  } = store.getState();
  const { language } = userConfig;
  const token = userInfo[PC_TOKEN_KEY];

  return {
    language,
    token,
  };
}
