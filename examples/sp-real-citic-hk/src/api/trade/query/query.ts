import { nanoid } from 'nanoid';

import { ITradeMarketType } from '@/constants/trade/markets';

import { postRequestAPI } from '../api';
import { OrderParams } from '../operate/operate';

export interface IMyPositionRequest {
  tradeMarket: string[]; // [HKEX, SHMK, SZMK, USA, FUND]
}

export interface IMyPositionItem {
  /**
   * 股票代码
   */
  stockCode: string;
  /**
   * 小市场号码，用于行情
   */
  smallMarket: number;
  /**
   * 股票名称
   */
  stockName: string;
  /**
   * 现价
   */
  lastPrice: number;
  /**
   * 成本价
   */
  costPrice: number;
  /**
   * 市场: HKEX, SHMK, SZMK, USA, FUND
   */
  tradeMarket: string;
  /**
   * 总盈亏
   */
  totalPL: number;
  /**
   * 总盈比例
   */
  totalPLPercent: string;
  /**
   * 持仓数量
   */
  currentQty: number;
  /**
   * 可用数量
   */
  enableQty: number;
  /**
   * 市值
   */
  marketValue: number;
  /**
   * 今日浮动盈亏
   */
  floatingPL: number;
  /**
   * 今日浮动盈亏比例
   */
  floatingPLPercent: number;
  /**
   * 持仓占比
   */
  holdRatio: string;
}

/**
 * 我的持仓数据
 */
export function fetchMyPosition(data: IMyPositionRequest) {
  return postRequestAPI<IMyPositionItem[]>('2301', data);
}

export interface OrderRequest {
  tradeMarket?: string[]; // [HKEX, SHMK, SZMK, USA, FUND]
  endDate?: string; // 日期格式：YYYY-MM-DD
  startDate?: string; // 日期格式：YYYY-MM-DD
}

/**
 * 委托数据
 */
export interface OrderItem {
  /**
   * 买卖方向
   */
  bs: 'B' | 'S';
  /**
   * 委托状态, 0已预约、1 待报、2 已报、3 待撤、4 部成待撤、5 部成部撤、6 已撤、7 部成、8 已成、9 已拒绝（下单失败）、10 未生效、11 已合并
   * 此中信项目没有0，中薇项目有0
   */
  status: number;
  /**
   * 委托状态描述
   */
  statusDescription: string;
  /**
   * 股票名称
   */
  stockName: string;
  /**
   * 股票代码
   */
  stockCode: string;
  /**
   * '0' | '1' 是否可撤回（0否、1是）, 对应status, 0, 1, 2
   */
  isCancel: '0' | '1';
  /**
   * '0' | '1' 是否可改单（0否、1是）, 对应status, 0, 1, 2
   */
  isModify: '0' | '1';
  /**
   * 均价
   */
  averagePrice: number;
  /**
   * 挂单量
   */
  qty: number;
  /**
   * 挂单价
   */
  orderPrice: number;
  /**
   * 触发价
   */
  stopPrice: number;
  /**
   * 最低价、限价
   */
  lowestLimitPrice: number;
  /**
   * 成交量
   */
  filledQty: number;
  /**
   * 下单时间
   */
  orderTime: string;
  /**
   * 市场: HKEX, SHMK, SZMK, USA, FUND
   */
  tradeMarket: string;
  /**
   * 订单委托类型
   */
  orderType: string;
  /**
   * 订单编号
   */
  orderNo: string;
  /**
   * 小市场号码
   */
  smallMarket: number;
  /**
   * 有效期限，格式: 2023-12-06
   */
  gtd: string;
}

/**
 * 获取当日委托数据
 */
export function queryTodayOrder(data?: OrderRequest) {
  return postRequestAPI<OrderItem[]>('2302', data);
}

export interface IEntrustmentDetailRequestParams {
  selectBy: QueryOrderDetailDateType;
  orderNo: string;
  // tradingAccSeq: string;
}

type IDealDetail = {
  dealTime: string;
  dealQty: number;
  dealPrice: number;
  dealAmount: number;
  [key: string]: any;
};

export interface IEntrustmentDetailItem {
  smallMarket: 2002;
  stockCode: string;
  stockName: string;
  orderTime: string;
  orderNo: string;
  qty: string;
  averagePrice: number;
  price: number;
  stopPrice: number;
  lowestLimitPrice: number;
  orderType: string;
  tradeMarket: string;
  bs: 'B' | 'S';
  currency: string;
  status: number;
  statusDescription: string;
  dealDetailList?: IDealDetail[];
}

/**
 * 获取委托详情
 */
export function fetchEntrustmentDetail(data: IEntrustmentDetailRequestParams) {
  return postRequestAPI<IEntrustmentDetailItem>('2304', data);
}

export interface ICompletedOrderDetail {
  stockCode: string;
  stockName: string;
  dealTime: string;
  orderNo: string;
  entrustQty: string;
  entrustPrice: number;
  qty: number;
  price: number;
  tradingPrice: number;
  currency: string;
  tradeMarket: string;
}

export enum QueryOrderDetailDateType {
  Today = 'T',
  History = 'H',
}

// export type ICompletedOrderDetailRequestParams = IEntrustmentDetailRequestParams & {
//   /**
//    * T: 今日成交, H: 历史成交
//    */
//   selectBy: QueryOrderDetailDateType;
// };

/**
 * 获取成交订单详情
 */
export function fetchCompletedOrderDetail(data: IEntrustmentDetailRequestParams) {
  return postRequestAPI<ICompletedOrderDetail>('2309', data);
}

/**
 * 获取历史委托数据
 */
export function fetchHistoryEntrustment(data?: OrderRequest) {
  return postRequestAPI<OrderItem[]>('2303', data);
}

export type ICompletedOrderRequest = OrderRequest;

export interface ICompletedOrderItem {
  dealTime: string; // 成交时间
  stockName: string; // 股票名称
  stockCode: string; // 股票代码
  tradeMarket: string; // [HKEX, SHMK, SZMK, USA, FUND]
  price: number; // 成交价
  qty: number; // 成交量
  bs: 'B' | 'S'; // 买卖方向
  amount: number; // 成交金额
  orderNo: string; // 订单编号
  orderQty: number; // 委托数量
  orderPrice: number; // 委托价格
}

/**
 * 获取当日成交数据
 */
export function fetchTodayCompletedOrders(data?: ICompletedOrderRequest) {
  return postRequestAPI<ICompletedOrderItem[]>('2305', data);
}

/**
 * 获取历史成交数据
 */
export function fetchHistoryCompletedOrders(data?: ICompletedOrderRequest) {
  return postRequestAPI<ICompletedOrderItem[]>('2306', data);
}

/**
 * 持仓盈亏
 */
export function fetchProfitOrLossOnPositions(data: {
  // HKEX, SHMK, SZMK, USA, FUND, MK。MK表示沪深
  tradeMarket: string;
}) {
  return postRequestAPI<any>('2310', data);
}

/**
 * 是否有基金&外盘数据
 */
export function fetchFundPermission() {
  return postRequestAPI<ICompletedOrderItem[]>('2311', {});
}

/**
 * 获取最大可买数量
 */
export function fetchMaximumPurchase(data: { price: number; stockCode: string; tradeMarket: string }) {
  return postRequestAPI<{
    /**
     * 最大可买数量
     */
    enableAmount: number;
    /**
     * 最大可买数量（3千万限额需求）
     */
    enableAmountLimt: number;
  }>('2308', data);
}

/**
 * 获取最大可卖数量
 */
export function queryCanSellNumber(data: { stockCode: string; tradeMarket: string }) {
  return postRequestAPI<{
    /**
     * 最大可卖数量
     */
    enableQty: number;
  }>('2341', data);
}

export interface IjournalAccountOfCapitalRequestParams {
  endDate?: string; // 日期格式：YYYY-MM-DD
  startDate?: string; // 日期格式：YYYY-MM-DD
}

/**
 * 资金流水接口数据
 */
export interface IJournalAccountOfCapitalItem {
  stockName: string;
  stockCode: string;
  typeDescription: string;
  tradeDate: string;
  inType: 'C' | 'O';
  settleAmount: string;
  settleRemark: string;
  currencyID: string;
}

/**
 * 获取资金流水
 */
export function fetchjournalAccountOfCapital(data?: IjournalAccountOfCapitalRequestParams) {
  return postRequestAPI<IJournalAccountOfCapitalItem[]>('2502', data).then((res) => ({
    ...res,
    result: res.result.map((item) => ({
      ...item,
      _id: nanoid(),
    })),
  }));
}

/**
 * @deprecated 光证使用预下单接口估算费用，参数与下单接口一致
 */
export interface IFetchTradeFeeParams {
  bs: 'B' | 'S';
  qty: number;
  stockCode: string;
  tradeMarket: ITradeMarketType;
  orderType: string;
  price?: string;
  stopPrice?: string;
  lowestLimitPrice?: string;
}

export interface IFetchTradeFeeResult {
  /**
   * 交易佣金
   */
  commissionFee: number;
  /**
   * 光证交易总费用预估
   */
  consideration: number;
  /**
   * 光证交易总费用预估，会返回一个token, token下单时需要带回去
   */
  orderToken: string;
  usa: {
    /**
     * 交收费
     */
    settlFee: number;
    /**
     * 证监会规费, 卖出专有
     */
    feesSFC: number;
    /**
     * 交易活动费, 卖出专有
     */
    transActivityFee: number;
  };
}

/**
 * 预估交易费用
 */
export function fetchTradeFee(data: OrderParams) {
  return postRequestAPI<IFetchTradeFeeResult>('2206', data);
}

export interface IUSTradingPermission {
  arLstMarket: Array<{ market: Market }>;
}
export enum Market {
  SZMK = 'SZMK',
  HKEX = 'HKEX',
  SHMK = 'SHMK',
  USA = 'USA',
}
export const getTradingAllowanceList = () => postRequestAPI<IUSTradingPermission>('2208');

export interface IEverbrightH5Params {
  accountNo: string;
  clientID: string;
  ipoAllowed: string;
  loginID: string;
  nwteloginID: string;
  nwtesessionToken: string;
  selectedAcctHash: string;
  sessionSuffix: string;
  tpClientID: string;
  tpLoginId: string;
  tpsessionToken: string;
  userDomain: string;
}

/**
 * 获取跳转光证H5页面需要的参数
 */
export function fetchEverbrightH5Params() {
  return postRequestAPI<IEverbrightH5Params>('2131');
}

/**
 * 获取可选GTD交易日期
 */
export function fetchQueryGTDTradeDates(): Promise<Record<string, string[]>> {
  // return Promise.resolve({
  //   code: 0,
  //   message: '请求成功',
  //   result: {
  //     marketGtdDays: [
  //       {
  //         gtDates: [
  //           {
  //             gtDate: '2024-01-25',
  //           },
  //           {
  //             gtDate: '2024-01-26',
  //           },
  //           {
  //             gtDate: '2024-01-29',
  //           },
  //           {
  //             gtDate: '2024-01-30',
  //           },
  //           {
  //             gtDate: '2024-01-31',
  //           },
  //           {
  //             gtDate: '2024-02-01',
  //           },
  //           {
  //             gtDate: '2024-02-02',
  //           },
  //           {
  //             gtDate: '2024-02-05',
  //           },
  //           {
  //             gtDate: '2024-02-06',
  //           },
  //           {
  //             gtDate: '2024-02-07',
  //           },
  //           {
  //             gtDate: '2024-02-08',
  //           },
  //           {
  //             gtDate: '2024-02-09',
  //           },
  //           {
  //             gtDate: '2024-02-14',
  //           },
  //           {
  //             gtDate: '2024-02-15',
  //           },
  //           {
  //             gtDate: '2024-02-16',
  //           },
  //           {
  //             gtDate: '2024-02-19',
  //           },
  //           {
  //             gtDate: '2024-02-20',
  //           },
  //           {
  //             gtDate: '2024-02-21',
  //           },
  //           {
  //             gtDate: '2024-02-22',
  //           },
  //           {
  //             gtDate: '2024-02-23',
  //           },
  //         ],
  //         tradeMarket: 'HKEX',
  //       },
  //       {
  //         gtDates: [
  //           {
  //             gtDate: '2024-01-25',
  //           },
  //           {
  //             gtDate: '2024-01-26',
  //           },
  //           {
  //             gtDate: '2024-01-29',
  //           },
  //           {
  //             gtDate: '2024-01-30',
  //           },
  //           {
  //             gtDate: '2024-01-31',
  //           },
  //           {
  //             gtDate: '2024-02-01',
  //           },
  //           {
  //             gtDate: '2024-02-02',
  //           },
  //           {
  //             gtDate: '2024-02-05',
  //           },
  //           {
  //             gtDate: '2024-02-06',
  //           },
  //           {
  //             gtDate: '2024-02-07',
  //           },
  //           {
  //             gtDate: '2024-02-08',
  //           },
  //           {
  //             gtDate: '2024-02-09',
  //           },
  //           {
  //             gtDate: '2024-02-12',
  //           },
  //           {
  //             gtDate: '2024-02-13',
  //           },
  //           {
  //             gtDate: '2024-02-14',
  //           },
  //           {
  //             gtDate: '2024-02-15',
  //           },
  //           {
  //             gtDate: '2024-02-16',
  //           },
  //           {
  //             gtDate: '2024-02-20',
  //           },
  //           {
  //             gtDate: '2024-02-21',
  //           },
  //           {
  //             gtDate: '2024-02-22',
  //           },
  //           {
  //             gtDate: '2024-02-23',
  //           },
  //         ],
  //         tradeMarket: 'USA',
  //       },
  //     ],
  //   },
  // })
  return postRequestAPI<any>('2334').then((res) => {
    try {
      const gtdDaysList = res.result.marketGtdDays;

      const mapTradeMarket = {};

      gtdDaysList.forEach((item) => {
        mapTradeMarket[item.tradeMarket] = (item?.gtDates || []).map((gtDateItem) => gtDateItem.gtDate);
      });

      return mapTradeMarket;
    } catch (e) {
      console.error(e);
      throw new Error('get trade dates error');
    }
  });
}

export interface IExchangeRate {
  cny: number;
  hkd: number;
  usd: number;
}

/**
 * 获取汇率(只支持兑换港币；不传默认就是港币)
 */
export function fetchExchangeRate(data = {}) {
  return postRequestAPI<IExchangeRate>('2504', data);
}
