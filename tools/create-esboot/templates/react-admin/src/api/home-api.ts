import type { IJavaBaseResponse } from './instance';
import { authedAxiosInst } from './instance';

interface HomeLoginInfo {
  modules: Record<string, unknown>[];
}

export function queryLoginInfo(): Promise<IJavaBaseResponse<HomeLoginInfo>> {
  return authedAxiosInst.post('/uc/home/loginInfo');
}
