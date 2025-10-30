// import { postRequestAPI } from '../trade/api';

import { formDataType } from '@/modules/quote-subscription/views/quotes-package-us-market-statement/constant/const';

import { authedQuotationInst } from './instance';

import type { IJavaAPICommonResponse } from '../types';

/**
 * 专业投资者认证个人资料获取
 * @returns
 */
export async function requestUserData(): Promise<IJavaAPICommonResponse<any>> {
  return authedQuotationInst.post('/quotation/pi/get/userData', {});
}

/**
 * 专业投资者认证进度
 * @returns
 */
export async function requestProgress(): Promise<IJavaAPICommonResponse<any>> {
  return authedQuotationInst.post('/quotation/pi/progress', {});
}

/**
 * 用户资料授权
 * @returns
 */
export async function requestAuthData(): Promise<IJavaAPICommonResponse<any>> {
  return authedQuotationInst.post('/quotation/pi/auth/data', {});
}
/**
 * 专业投资者认证个人资料确认
 * @returns
 */
export async function requestDataConfirm(data: formDataType): Promise<IJavaAPICommonResponse<any>> {
  return authedQuotationInst.post('/quotation/pi/data/confirm', data);
}

/**
 * 专业投资者选择题目获取
 * @returns
 */
export async function requestSlectData(
  params: { types: string[] }, // 明确参数类型
): Promise<IJavaAPICommonResponse<any>> {
  return authedQuotationInst.post('/quotation/common/dictList', params); // 将参数传递给post请求
}

/**
 * 专业投资者选择题目答案提交
 * @returns
 */
export async function submitSlectData(
  params: Record<string, boolean>, // 修改为接受对象参数
): Promise<IJavaAPICommonResponse<any>> {
  return authedQuotationInst.post('/quotation/pi/answer/submit', params);
}

/**
 * 专业投资者选择题目答案回显
 * @returns
 */
export async function requestSlectDatast(): Promise<IJavaAPICommonResponse<any>> {
  return authedQuotationInst.post('/quotation/pi/progress', {});
}
