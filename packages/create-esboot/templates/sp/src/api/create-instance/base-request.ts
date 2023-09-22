import { initReqInfo } from '@dz-web/request';
import staticConfig from '@/helpers/static-config';
import { Language } from '../../constants/config';
// import logger from '@mobile/helpers/logger';

const reqInfo = initReqInfo({
  defaultBaseUrl: staticConfig.getCommonServer(),
  defaultTimeout: 1000 * 6 * 3,
  reqInfo: () => ({
    token: '',
    language: Language.EN_US,
  }),
  // logger,
  responseInterceptors: (response: any) => {
    const { code, message } = response.data;
    if (code === 990151) {
      if (process.env.NODE_ENV === 'production') {
        // userStatusChange({
        //   userStatus: UserStatus.sessioncode_expired,
        //   message,
        // });
      } else {
        console.log(`%ctip: ${message}`, 'color:red');
      }
      return null;
    }
    return response.data;
  },
});

export const {
  baseReqInstance,
  baseReqInstanceByProxy,
  createReqInstance,
  createReqInstanceByProxy,
  userTokenProxyInfo,
} = reqInfo;
