import axios from 'axios';
import { createDZAxiosInstance } from '@dz-web/axios';
import { createBasicPatternMiddleware } from '@dz-web/axios-middlewares';
import { logout } from '@/utils/logout';
import { getPlatformIndependentUserConfig } from '@/utils/platfom-indepent/user-config';

export interface IJavaBaseResponse<Data = any> {
  code: number;
  message: string;
  result: Data;
}

const isBusinessError = (data: IJavaBaseResponse) => data.code !== 0;

export const authedAxiosInst = createDZAxiosInstance(() => axios.create({
  baseURL: 'http://183.57.47.83:31080',
}), [
  createBasicPatternMiddleware({
    addHeaders: () => {
      const { language, token } = getPlatformIndependentUserConfig();
      return {
        sessionCode: token,
        'Accept-Language': language,
      };
    },
    isBusinessError,
    // 正常返回，但业务code指示为非0，业务错误
    onBusinessError: (data) => {
      if (data.code === 401) {
        logout({
          code: data.code,
          message: data.message,
        });
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
]);

export const axiosInst = createDZAxiosInstance(() => axios.create({
  baseURL: 'http://183.57.47.83:39898',
}), [
  createBasicPatternMiddleware({
    addHeaders: () => {
      const { language } = getPlatformIndependentUserConfig();
      return {
        'Accept-Language': language,
      };
    },
    isBusinessError,
  }),
]);
