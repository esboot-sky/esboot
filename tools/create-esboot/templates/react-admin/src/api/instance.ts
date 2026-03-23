import { createDZAxiosInstance } from '@dz-web/axios';
import { createBasicPatternMiddleware } from '@dz-web/axios-middlewares';
import { message } from 'antd';
import axios from 'axios';

import StaticConfig from '@/helpers/static-config';
import { useAppStore } from '@/model/app';

import { RESPONSE_CODE } from './types';

export interface IJavaBaseResponse<Data = any> {
  code: number;
  message: string;
  result: Data;
}

const baseURL = StaticConfig.getCommonServer();

const isBusinessError = (data: IJavaBaseResponse) => data.code !== 0;

export const authedAxiosInst = createDZAxiosInstance(
  () =>
    axios.create({
      baseURL,
    }),
  [
    createBasicPatternMiddleware({
      addHeaders: () => {
        const { token, lang } = useAppStore.getState();

        return {
          token,
          'Accept-Language': lang,
        };
      },
      isBusinessError,
      onBusinessError: (data) => {
        message.error(data.message);

        if (data.code === RESPONSE_CODE.LOGIN_EXPIRED) {
          const { reset } = useAppStore.getState();
          reset();
        }
      },
    }),
  ],
);

export const axiosInst = createDZAxiosInstance(
  () =>
    axios.create({
      baseURL,
    }),
  [
    createBasicPatternMiddleware({
      isBusinessError,
      onBusinessError(data) {
        message.error(data.message);
      },
    }),
  ],
);
