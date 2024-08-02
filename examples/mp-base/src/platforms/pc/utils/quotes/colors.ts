import { RaiseModeColorScheme, RaiseMode } from '@pc/constants/config';

/**
 * 传入redux中的保存的涨跌颜色模式，返回对应的up down颜色, 如果与页面需求不一致，可以不使用这个，
 * 自己根据raise值red, green判断，red表示红涨绿跌，green表示相反的绿涨红跌，只有正反向两种，但颜色可以多种，参与此函数的实现
 */
export function getRaiseModeColor(raiseMode: RaiseMode) {
  const colorScheme = RaiseModeColorScheme[raiseMode];

  if (colorScheme) {
    return colorScheme;
  }

  // 如不存在，返回默认
  return RaiseModeColorScheme.red;
}
