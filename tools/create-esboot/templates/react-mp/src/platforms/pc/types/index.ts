/**
 * 不同的app user info不可能统一格式
 * 在这里根据app提供的内容，改成自己的格式即可
 */
export interface UserInfo {
  sessionCode: string;
  areaCode: string;
  avatar: string;
  bcanStatus: 'Y';
  cusNo: number;
  isLoginTrade: boolean;
  mobile: string;
  nickname: string;
  stoken: string;
  tradeNo: string;
  userId: number;
}
