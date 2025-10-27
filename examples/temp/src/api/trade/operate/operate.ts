import { postRequestAPI } from '../api';

export interface OrderParams {
  /**
   * 买卖方向, B: 买入, S: 卖出
   */
  bs: string;
  /**
   * 委托类型
   */
  orderType: string;
  /**
   * 委托数量
   */
  qty: number;
  /**
   * 股票代码
   */
  stockCode: string;
  /**
   * 交易市场
   * 市场[HKEX,SHMK,SZMK,USA,FUND]
   */
  tradeMarket: string;
  /**
   * 截止日期yyyy-MM-dd（默认当天）GTD
   */
  gtd?: string;
  /**
   * 委托价格
   */
  price?: string;
  /**
   * 条件单触发价格
   */
  stopPrice?: string;
  /**
   * 条件止损单最低卖出价
   */
  lowestLimitPrice?: string;
  /**
   * 状态（true:稍后生效，false：立即生效） 默认 false
   */
  inactiveFlag?: boolean;
  /**
   * 允许盘前成交
   */
  preTradingFlag?: 'Y' | 'N';
  /**
   * 允许部分成交
   */
  // partialFlag: 'Y' | 'N';
  // password: string;
}

export const RequestOrderErrorCode = {
  /**
   * 美股延长交易时段
   */
  USPreMarkerDisclaimerError: 539,
  /*
   @ApiModelProperty(value = "碎股提醒：Y提醒 / N不提醒（光证定制）", required = true)
    private String broadLot;

    @ApiModelProperty(value = "开市前提醒：Y提醒 / N不提醒（光证定制）", required = true)
    private String preMarket;

    @ApiModelProperty(value = "触发价警告：Y提醒 / N不提醒（光证定制）", required = true)
    private String priceWarnFlag;
  */
  // 指定broadLot=Y时，碎股时报错代码，会提示您已選擇了碎股落盤，是否繼續執行指令？
  OddLotError: 414,
  // 客户提交的单据非盘中时段，需要弹出弹窗提示, 交易市场未开盘，确认要在盘前时段下单吗？
  BeforeTradeTimeError: 415,
  // 客户委托金额超市价±10%，需要弹出弹窗提示
  widePriceError: 552,
  hkidrError: 557,
} as const;

/**
 * 委托下单
 */
export function order(data: OrderParams) {
  return postRequestAPI<{
    /**
     * 委托单号
     */
    orderNo: string;
  }>('2202', data);
}

export enum CancelOrChangeType {
  CANCEL = 0,
  CHANGE = 1,
}

export interface IModifyOrCancelOrderRequest {
  /**
   * 委托单号
   */
  orderNo: string;
  /**
   * 0 撤单, 1改单
   */
  type: CancelOrChangeType;
  /**
   * 委托价格
   */
  price?: string;
  /**
   * 委托数量
   */
  qty?: number;
}

/**
 * 委托改单、撤单
 */
export function modifyOrCancelOrder(data: IModifyOrCancelOrderRequest) {
  return postRequestAPI<{
    /**
     * 委托单号
     */
    orderNo: string;
  }>('2203', data);
}
