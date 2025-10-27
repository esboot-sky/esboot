import { createDZAxiosInstance } from '@dz-web/axios';
import { createBasicPatternMiddleware } from '@dz-web/axios-middlewares';
import axios from 'axios';

import staticConfig from '@/helpers/static-config';

import { IJavaAPICommonResponse } from '../types';

const isBusinessError = (data: IJavaAPICommonResponse) => data.code !== 0;

const baseURL = `${staticConfig.gatewayServerUrl}/market`;

const basicConfig = {
  isBusinessError,
};

export const marketAPIInst = createDZAxiosInstance(
  () =>
    axios.create({
      baseURL,
    }),
  [createBasicPatternMiddleware(basicConfig)],
);
