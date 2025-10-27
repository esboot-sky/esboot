import { createDZAxiosInstance } from '@dz-web/axios';
import { createBasicPatternMiddleware, globalBlocker } from '@dz-web/axios-middlewares';
import axios from 'axios';

import staticConfig from '@/helpers/static-config';
import { useAppStore } from '@/model/app';
import { logout } from '@/utils/logout';

import { IJavaAPICommonResponse } from './types';
import { isExpired } from './watchlist/codes';

const isBusinessError = (data: IJavaAPICommonResponse) => data.code !== 0;
const baseURL = staticConfig.gatewayServerUrl;

export const authedCommonJavaInst = createDZAxiosInstance(
  () =>
    axios.create({
      baseURL,
    }),
  [
    globalBlocker.middleware,
    createBasicPatternMiddleware({
      addHeaders: () => {
        const { language, token } = useAppStore.getState();
        return {
          Token: token,
          'Accept-Language': language,
        };
      },
      isBusinessError,
      onBusinessError: (data) => {
        if (isExpired(data.code)) {
          logout({
            code: data.code,
            message: data.message,
          });
        }
      },
    }),
  ],
);

export const commonJavaInst = createDZAxiosInstance(
  () =>
    axios.create({
      baseURL,
    }),
  [
    createBasicPatternMiddleware({
      addHeaders: () => {
        const { language } = useAppStore.getState();
        return {
          'Accept-Language': language,
        };
      },
      isBusinessError,
    }),
  ],
);
