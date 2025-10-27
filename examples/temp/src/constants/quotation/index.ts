// 1 是港股 2 是A股 3 是美股 定義為marketType
export const marketType = {
  HK: '1',
  CN: '2',
  US: '3',
} as const;

/**
 * 市场类型
 */
export const MarketTypeList = [
  {
    label: '香港市场',
    value: marketType.HK,
  },
  // 暂时 不显示A股市场
  // {
  //   label: 'A股市场',
  //   value: marketType.CN,
  // },
  {
    label: '美国市场',
    value: marketType.US,
  },
];

/**
 * product_detail 行情套餐详情
 * self_all 自选股
 */
export const pagekey = {
  product_detail: 'product_detail',
  self_all: 'self_all',
} as const;
