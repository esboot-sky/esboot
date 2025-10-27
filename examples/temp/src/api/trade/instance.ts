import { createDZAxiosInstance } from '@dz-web/axios';
import {
  createBasicPatternMiddleware,
  globalBlocker,
  createEncryptedGatewayMiddleware,
} from '@dz-web/axios-middlewares';
import { Toast } from 'antd-mobile';
import axios from 'axios';

import { publicKey } from '@/constants/trade/public-key';
import staticConfig from '@/helpers/static-config';
import { useAppStore } from '@/model/app';
import { logout } from '@/utils/logout';

import { ITradeAPIResponse } from './api';
import { isExpired, TRADING_COUNTER_UNDER_MAINTENANCE } from './codes';
import { initEncryptKey } from './encrypt-api';

const isBusinessError = (data: ITradeAPIResponse) => {
  return data.code !== 0;
};

const baseURL = staticConfig.gatewayServerUrl;

export const encryptor = createEncryptedGatewayMiddleware({
  fetchKey: async (postKey: string) => initEncryptKey(baseURL, postKey),
  publicKey,
});

/**
 * 需要登录的请求使用这个axios实例
 */
export const authedTradeAxiosInst = createDZAxiosInstance(
  () =>
    axios.create({
      baseURL,
    }),
  [
    globalBlocker.middleware,
    ...(staticConfig.enableEncrypt ? encryptor.middlewares : []),
    createBasicPatternMiddleware({
      addHeaders: () => {
        const { language, token } = useAppStore.getState();
        return {
          Token: token,
          'Content-Type': 'application/json',
          'Accept-Language': language,
        };
      },
      isBusinessError,
      // 正常返回，但业务code指示为非0，业务错误
      onBusinessError: (data) => {
        console.log(data, 'data');
        if (isExpired(data.code)) {
          logout({
            code: data.code,
            message: data.message,
          });
        } else if (data.message) {
          Toast.show(data.message);
        }
      },
      // 非2xx请求，或网络错误
      onFatalError(error, res) {
        if (res.status === 401) {
          logout({
            code: 76,
            message: res.statusText,
          });
        }
      },
    }),
  ],
);

/**
 * 不需要登录的请求使用这个axios实例
 */
export const tradeAxiosInst = createDZAxiosInstance(
  () =>
    axios.create({
      baseURL,
    }),
  [
    ...(staticConfig.enableEncrypt ? encryptor.middlewares : []),
    createBasicPatternMiddleware({
      addHeaders: () => {
        const { language } = useAppStore.getState();
        return {
          'Accept-Language': language,
        };
      },
      isBusinessError,
      // 正常返回，但业务code指示为非0，业务错误
      onBusinessError: (data) => {
        if (data.code === TRADING_COUNTER_UNDER_MAINTENANCE) {
          logout({ message: data.message });
        }
      },
    }),
  ],
);
