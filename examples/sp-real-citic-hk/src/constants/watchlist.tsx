export enum WatchlistGroupEnum {
  Other = 0,
  All = 2,
  HKGroup = 10, // 港股
  USGroup = 12, // 美股
}

export const ChoiceStockBlockId = {
  [WatchlistGroupEnum.HKGroup]: [2900],
  [WatchlistGroupEnum.USGroup]: [43000],
  [WatchlistGroupEnum.All]: [2900, 43000],
};
