export interface IJavaAPICommonResponse<T = any> {
  code: number
  message: string
  result: T
}

export interface IPaginationParams {
  pageNum?: number
  pageSize?: number
}

export interface IOrderParams {
  orders?: { asc: boolean; column: string }[]
}

export type IListAPIParams = IPaginationParams & IOrderParams

export interface IJavaListAPIResult<T> {
  current: number
  pages: number
  records: T[]
  size: number
  total: number
}

export type IJavaListResponse<T = any> = IJavaAPICommonResponse<IJavaListAPIResult<T>>
