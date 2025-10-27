/**
 * 筛选股票
 * @param arr 查询到的股票数组
 * @param data 查询参数
 */
export const filterStock = (arr, data) => {
  if (!arr.length) return false;
  if (!data || !data.name) return arr[0];

  const fristItem = arr.find((item) => item.code === data.code && item.name === data.name);
  return fristItem || arr[0];
};

export const replaceSymbol = (original: string, rule = /[-]/g, target = '/'): string => original.replace(rule, target);
