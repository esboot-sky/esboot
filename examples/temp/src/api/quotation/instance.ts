import { createDZAxiosInstance } from '@dz-web/axios';
import { createBasicPatternMiddleware, globalBlocker } from '@dz-web/axios-middlewares';
import axios from 'axios';

import staticConfig from '@/helpers/static-config';
import { useAppStore } from '@/model/app';
import { logout } from '@/utils/logout';

import { IJavaAPICommonResponse } from '../types';

import { isExpired } from './codes';

const isBusinessError = (data: IJavaAPICommonResponse) => data.code !== 0;
const baseURL = staticConfig.gatewayServerUrl;

const basicConfig = {
  addHeaders: () => {
    const { language, token } = useAppStore.getState();
    return {
      Token: token,
      'Accept-Language': language,
    };
  },
  isBusinessError,
  onBusinessError: (data: IJavaAPICommonResponse) => {
    if (isExpired(data.code)) {
      logout({
        code: data.code,
        message: data.message,
      });
    }
  },
};

export const authedQuotationInst = createDZAxiosInstance(
  () =>
    axios.create({
      baseURL,
    }),
  [globalBlocker.middleware, createBasicPatternMiddleware(basicConfig)],
);
