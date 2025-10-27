export interface IJavaAPICommonResponse<T = any> {
  code: number;
  message: string;
  result: T;
}

export interface IJavaFilterQuery {
  keyword?: string;
  pageNum?: number;
  pageSize?: number;
  orders?: {
    asc: boolean;
    column: string;
  }[];
}

export interface IJavaFilterResult<T> {
  current: number;
  pages: number;
  records: T[];
  size: number;
  total: number;
}

export type IJavaFilterResponse<T = any> = IJavaAPICommonResponse<IJavaFilterResult<T>>;

// 行情库暂时没有公共的类型，但又要统一使用market名称，用于表示一个行情商品，所以这里先放一个
export interface CommodityQuoteKey {
  market: number;
  code: string;
  blockId?: number;
}
