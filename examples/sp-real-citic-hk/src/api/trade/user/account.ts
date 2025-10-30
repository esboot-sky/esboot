import { postRequestAPI } from '../api';

export interface AccountInfoResponse {
  clientId: string; // 客户号
  clientType: string; // 帐户类别（C：现金帐户、M：Margin帐 户）
  /**
   * 帐户持有人名称
   */
  name: string;
}

/**
 * 获取我名下的帐户列表，普通帐户，融资帐户
 */
export function fetchMyAccounts() {
  return postRequestAPI<AccountInfoResponse>('2109');
}

/**
 * 切换激活的帐户, 普通帐户，融资帐户
 */
export function changeCurrentAccount(tradingAccSeq: string) {
  return postRequestAPI('2111', {
    tradingAccSeq,
  });
}

/**
 * 获取用户身份证信息
 */
export function queryIdInfo(data) {
  return postRequestAPI('2123', data);
}

interface IHkIdR {
  bcanConsent: string;
  bcanMarket: string;
  clientId: string;
}
/**
 * HKIDR是否签署
 * @param data
 * @returns
 */
export function updateHKIDR(data: IHkIdR) {
  return postRequestAPI('2128', data);
}

// 外汇出入金承诺函
export function queryForeign() {
  return postRequestAPI('2117');
}

export interface IForeign {
  riskConsent: string;
}
// 更新签署
export function updateForeign(data: IForeign) {
  return postRequestAPI('2118', data);
}
