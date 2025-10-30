import { isAndroid, isIOS } from '@dz-web/esboot-browser';
import { AxiosRequestConfig } from 'axios';

import { tradeAxiosInst, authedTradeAxiosInst } from './instance';

export interface ITradeAPIResponse<R = any> {
  code: number;
  message: string;
  result: R;
  success: boolean;
}

export function requestAPI<Res>(
  mf: number,
  hasToLogin = true,
  config: AxiosRequestConfig = {},
): Promise<ITradeAPIResponse<Res>> {
  return (hasToLogin ? authedTradeAxiosInst : tradeAxiosInst).request({
    url: '/trading/trans/Handle.aspx',
    params: {
      MF: mf,
    },
    ...config,
    headers: {
      // eslint-disable-next-line no-nested-ternary
      channelID: isIOS ? 'ME' : isAndroid ? 'MF' : '',
      MF: mf,
      ...config.headers,
    },
  });
}

export function getRequestAPI<Res>(
  params: any,
  mf: number,
  hasToLogin = true,
  config: AxiosRequestConfig = {},
): Promise<ITradeAPIResponse<Res>> {
  return requestAPI<Res>(mf, hasToLogin, {
    ...config,
    params,
    method: 'GET',
  });
}

export function postRequestAPI<Res>(mf, data: any = {}, hasToLogin = true, config: AxiosRequestConfig = {}) {
  return requestAPI<Res>(mf, hasToLogin, {
    ...config,
    data,
    method: 'POST',
  });
}
