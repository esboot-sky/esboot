export enum RESPONSE_CODE {
  LOGIN_EXPIRED = 990151, // 登录过期
}

export interface SortOrder {
  asc: boolean;
  column: string;
}

export interface PaginationQuery {
  pageNum: number;
  pageSize: number;
  orders?: SortOrder[];
}

export interface PagedResult<T> {
  records: T[];
  total: number;
}

export interface IdPayload {
  id: number;
}

export interface IdsPayload {
  ids: number[];
}

export type ExportParams = Record<string, string | number | boolean | null | undefined>;
