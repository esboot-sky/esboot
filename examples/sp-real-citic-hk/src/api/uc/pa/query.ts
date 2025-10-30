import { authedQuotationInst } from '@/api/quotation/instance';
import { IJavaAPICommonResponse } from '@/api/types';

const baseRoute = '/uc/pa';

export interface TradePreCheckResponse {
  hkidr: boolean;
  identity: 'transaction' | 'visitor' | 'customer';
  isW8Finish: boolean;
  token: string;
}

/**
 * 获取交易前置判断
 * @returns
 */
export function queryTradePreCheck() {
  return authedQuotationInst.post<IJavaAPICommonResponse<TradePreCheckResponse>>(`${baseRoute}/dms/login/status`, {});
}

export interface CheckLoginResponse {
  isVisitor: boolean;
  loginId: Record<string, never>;
  tokenValue: string;
}
