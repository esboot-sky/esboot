import { describe, expect, it } from 'vitest';

import { getRaiseModeColor } from './colors';

import '@mobile/helpers/theme';

describe('测试', () => {
  it('获取涨跌颜色函数存在', () => {
    expect(typeof getRaiseModeColor === 'function').toBeTruthy();
  });
});
