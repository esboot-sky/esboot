export enum RESPONSE_CODE {
  LOGIN_EXPIRED = 990151, // 登录过期
}

export type SortOrder = {
  asc: boolean;
  column: string;
};

export type PaginationQuery = {
  pageNum: number;
  pageSize: number;
  orders?: SortOrder[];
};

export type PagedResult<T> = {
  records: T[];
  total: number;
};

export type IdPayload = {
  id: number;
};

export type IdsPayload = {
  ids: number[];
};

export type ExportParams = Record<string, string | number | boolean | null | undefined>;
