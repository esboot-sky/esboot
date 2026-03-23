import { authedAxiosInst } from './instance';
import { IJavaBaseResponse } from './instance';

type HomeLoginInfo = {
  modules: Record<string, unknown>[];
};

export const queryLoginInfo = (): Promise<IJavaBaseResponse<HomeLoginInfo>> => {
  return authedAxiosInst.post('/uc/home/loginInfo');
};
