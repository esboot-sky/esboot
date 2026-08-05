import { createDZAxiosInstance } from '@dz-web/axios';
import { createBasicPatternMiddleware } from '@dz-web/axios-middlewares';
import axios from 'axios';

import staticConfig from '@/helpers/static-config';
import { useLoginStore } from '@/model';

export interface IJavaBaseResponse<Data = any> {
  code: number;
  message: string;
  result: Data;
}

const isBusinessError = (data: IJavaBaseResponse) => data.code !== 0;
const BASE_URL = staticConfig.getCommonServer('base', '');

/**
 * 需要登录的请求使用这个axios实例
 */
export const authedAxiosInst = createDZAxiosInstance(
  () =>
    axios.create({
      baseURL: BASE_URL,
    }),
  [
    createBasicPatternMiddleware({
      addHeaders: () => {
        const { lang, token } = useLoginStore.getState();
        return {
          token,
          'Accept-Language': lang,
        };
      },

      isBusinessError,
      // 正常返回，但业务code指示为非0，业务错误
      onBusinessError: (data) => {
        if (data.code === 401) {
          console.log(423);
        }
      },
      // 非2xx请求，或网络错误
      onFatalError(_error, res) {
        if (res.status === 401) {
          console.log(24332);
        }
      },
    }),
  ],
);

/**
 * 不需要登录的请求使用这个axios实例
 */
export const axiosInst = createDZAxiosInstance(
  () =>
    axios.create({
      baseURL: BASE_URL,
    }),
  [
    createBasicPatternMiddleware({
      isBusinessError,
    }),
  ],
);
