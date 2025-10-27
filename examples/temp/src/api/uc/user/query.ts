import { authedQuotationInst } from '@/api/quotation/instance';
import { IJavaAPICommonResponse } from '@/api/types';

// 获得用户id 头像
export interface ICustomerInfoGet {
  age?: number;
  areaCode?: string;
  avatar: string; // 头像
  cusNo: number; // 用户id
  gender?: number;
  id?: number;
  mobile?: string;
  nickname: string; // 用户昵称
  tradeAccounts?: string[];
}
/**
 * 获取用户信息
 * @returns
 */
export function requestCustomerInfoGet() {
  return authedQuotationInst.post<IJavaAPICommonResponse<ICustomerInfoGet>>('/uc/customer/info/get', {});
}
