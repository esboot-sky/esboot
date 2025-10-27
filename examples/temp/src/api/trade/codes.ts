// 登录过期
export const ExpiredToken = 30231;
export const ExpiredToken2 = 76;
export const ExpiredToken3 = 990151; // 设备在其它设备登入

// 交易柜台正在维护中
export const TRADING_COUNTER_UNDER_MAINTENANCE = 990161;

export function isExpired(code: number) {
  return (
    code === ExpiredToken ||
    code === ExpiredToken2 ||
    code === ExpiredToken3 ||
    code === TRADING_COUNTER_UNDER_MAINTENANCE
  );
}
