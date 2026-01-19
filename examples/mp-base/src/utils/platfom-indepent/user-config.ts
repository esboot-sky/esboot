/* eslint-disable @dz-web/esboot/no-cross-platform-imports */
import { TOKEN_KEY as MOBILE_TOKEN_KEY } from '@mobile/constants/config';
import { useAppStore as useMobileAppStore } from '@mobile/model/app/slice';

import { TOKEN_KEY as PC_TOKEN_KEY } from '@pc/constants/config';
import { usePCStore } from '@/platforms/pc/model/pc';
import { isMobile } from '@/utils/platforms';

export function getPlatformIndependentUserConfig() {
  if (isMobile()) {
    const { userConfig, userInfo } = useMobileAppStore.getState();
    const { language } = userConfig;
    const token = userInfo[MOBILE_TOKEN_KEY];

    return {
      language,
      token,
    };
  }

  const { userConfig, userInfo } = usePCStore.getState();
  const { language } = userConfig;
  const token = userInfo[PC_TOKEN_KEY];

  return {
    language,
    token,
  };
}
