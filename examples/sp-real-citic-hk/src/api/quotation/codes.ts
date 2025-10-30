/**
 * 设备在其它设备登入
 */
export const ExpiredToken = 990151;

export function isExpired(code: number) {
  return code === ExpiredToken;
}
