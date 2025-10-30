import { postRequestAPI } from '../trade/api';

import { authedQuotationInst } from './instance';

import type { IJavaAPICommonResponse } from '../types';

export interface UserQuotationPermissionResponse {
  products: {
    code: string;
    level: number;
    marketType: number;
    supplier: string;
    supplierName: string;
    enableEnd: string | null;
    enableStart: string | null;
  }[];
  clickProducts: string[];
  tips: string;
}

/**
 * 获取套餐权限
 */
export async function fetchUserQuotationPermission(
  data = {},
): Promise<IJavaAPICommonResponse<UserQuotationPermissionResponse>> {
  return authedQuotationInst.post('/quotation/user/product/permissions', data);
}

/**
 * 优选网关
 */
export async function fetchGatewayList(data = {}): Promise<IJavaAPICommonResponse<any>> {
  return authedQuotationInst.post('/quotation/gateway/list', data);
}

export interface MarketPermissionItem {
  code: string;
  name: string;
  marketType: number;
  /**
   * 权限等级:0=level0 ; 10=level1 ; 20=level2
   */
  level: string;
  enableEnd: string;
  packageId: string;
}

export interface MarketQuotePermissionsResponse {
  orgCode: string;
  cid: number;
  markets: MarketPermissionItem[];
}

export async function fetchMarketQuotePermissions(): Promise<IJavaAPICommonResponse<MarketQuotePermissionsResponse>> {
  return authedQuotationInst.post('/quotation/user/market/permissions', {});
}

// 套餐详情接口
export interface IPackageDetail {
  count: number;
  currency: string;
  id: string;
  img: string;
  name: string;
  price: number;
  regionType: number;
  terminal: number[];
  availableArea: string;
  type: number;
  isPi: boolean;
  product: {
    type: string | number;
    productName: string;
    code: string;
    id: number;
  };
  period: number;
  specialPrice: number;
  specialEndDate: string;
}

/**
 * 套餐详情
 * @param id
 * @returns
 */
export function requestPackageDetail(id: string) {
  return authedQuotationInst.post<IJavaAPICommonResponse<IPackageDetail>>('/quotation/package/detail', { id });
}

// 已开通行情套餐列表
export interface IOpenList {
  enableDate: string;
  name: string;
  autoRenew: boolean;
}

/**
 *已开通行情套餐列表
 * @returns
 */
export function requestOpenList() {
  return authedQuotationInst.post<IJavaAPICommonResponse<IOpenList[]>>('/quotation/package/purchased', {});
}

// 行情套餐列表
export interface IQuoList {
  autoRenew: boolean;
  count: number;
  currency: string;
  id: string;
  img: string;
  name: string;
  price: number;
  description: string;
  hasSpecial: boolean;
  specialPrice: number;
}

export interface IRequestQuoList {
  marketType: string;
}

/**
 *行情套餐列表
 * @returns
 */
export function requestQuoList(params: IRequestQuoList) {
  return authedQuotationInst.post<IJavaAPICommonResponse<IQuoList[]>>('/quotation/package/list', params);
}

// 取消自动续订参数
export interface RequestOrderCancelRenew {
  customerId?: number;
  packageId: string; // 套餐Id
}

/**
 *取消自动续订
 * @returns
 */
export function requestCancelRenew(data: RequestOrderCancelRenew) {
  return authedQuotationInst.post<IJavaAPICommonResponse<any>>('/quotation/order/cancel/renew', data);
}

// 购买串流行情套餐参数
export interface RequestOrderSave {
  autoRenew?: boolean;
  customerId?: number;
  enableStart: string;
  isGive?: boolean;
  num: number;
  packageId: string;
}

/**
 *购买串流行情套餐
 * @returns
 */
export function requestSave(data: RequestOrderSave) {
  return authedQuotationInst.post<IJavaAPICommonResponse<any>>('/quotation/order/buy', data);
}

type IEnableStatus = 1 | 2 | 3;

// 定义枚举常量
export enum IPayType {
  AUTO_RENEW_PAY = 'AUTO_RENEW_PAY',
  ONCE_PAY = 'ONCE_PAY',
}

/**
 * 获取行情历史订单列表
 */
export interface IOrderQuoList {
  createTime: string;
  duration: string;
  enableEnd: string;
  enableStart: string;
  name: string;
  status: string;
  enableStatus: IEnableStatus;
  type: number;
  amount: number;
  payType: IPayType;
  enableEndDate: string;
  enableStartDate: string;
  period: string;
  currency: string;
}

/**
 *获取行情历史订单列表
 * @returns
 */
export function requestOrderQuoList() {
  return authedQuotationInst.post<IJavaAPICommonResponse<IOrderQuoList[]>>('/quotation/order/list', {});
}

/**
 * 验证订单的请求参数
 */
export interface RequestOrderVerify {
  enableStart: string;
  num: number;
  packageId: string;
}

/**
 * 验证订单的接口
 */
export interface IOrderVerify {
  amount: number;
  enableEnd: string;
  enableStart: string;
  disableStart: boolean;
}

/**
 *验证订单
 * @returns
 */
export function requestOrderVerify(data: RequestOrderVerify) {
  return authedQuotationInst.post<IJavaAPICommonResponse<IOrderVerify>>('/quotation/order/verify', data);
}

export interface IUserDetail {
  accountType: string;
  balances: Balance[];
  account: string;
}

interface Balance {
  buyingPower: number;
  currency: string;
  name: string;
  withdrawableBalance: number;
}

/**
 * 获取用户详情
 * @returns
 */
export function requsetUserDetail() {
  return authedQuotationInst.post<IJavaAPICommonResponse<IUserDetail>>('/quotation/user/detail', {});
}

/**
 * 资金明细
 * @param
 * @returns
 */
export function requestFundDetail() {
  return postRequestAPI(2505, {});
}

/**
 * 用户信息
 * @param
 * @returns
 */
export function requestAccountDetail() {
  return postRequestAPI(2120, {});
}

// 定义枚举常量
export enum ITypes {
  page_tips = 'page_tips',
}

interface IDictList {
  types?: Array<string>;
}
/**
 * 获取字典列表
 * @param data
 * @returns
 */
export async function fetchDictList(data: IDictList): Promise<IJavaAPICommonResponse<any>> {
  return authedQuotationInst.post('/quotation/common/dictList', data);
}

export enum AuthProgress {
  AUTH_DATA = 'AUTH_DATA', // 授权用户资料
  USER_DATA = 'USER_DATA', // 个人资料
  ANSWER = 'ANSWER', // 专业投资者问题
  REVIEW_ING = 'REVIEW_ING', // 审核中
  REJECT = 'REJECT', // 审核不通过
  SUCCESS = 'SUCCESS', // 审核通过
}

export interface IPiProgress {
  authProgress: AuthProgress | string;
}

/**
 * 获取pi进度
 * @returns
 */
export async function fetchPiProgress(): Promise<IJavaAPICommonResponse<any>> {
  return authedQuotationInst.post('/quotation/pi/progress', {});
}

/**
 * 是否确认免责声明
 * @returns
 */
export async function queryIsConfirmDisclaimer(): Promise<IJavaAPICommonResponse<{ isConfirmed: boolean }>> {
  return authedQuotationInst.post('/quotation/user/disclaimer/confirmed', {});
}

/**
 * 确认免责声明
 * @returns
 */
export async function confirmQuoteDisclaimer(): Promise<IJavaAPICommonResponse<any>> {
  return authedQuotationInst.post('/quotation/user/disclaimer/confirm', {});
}
