import { describe, test, expect } from 'vitest';

import '@mobile/helpers/theme';

import { getRaiseModeColor } from './colors';

describe('测试', () => {
  test('获取涨跌颜色函数存在', () => {
    expect(typeof getRaiseModeColor === 'function').toBeTruthy();
  });
});
