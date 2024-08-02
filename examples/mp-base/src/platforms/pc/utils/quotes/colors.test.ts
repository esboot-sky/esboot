import { describe, test, expect } from 'vitest';

import '@pc/constants/config';

import { getRaiseModeColor } from './colors';

describe('测试', () => {
  test('获取涨跌颜色函数存在', () => {
    console.log('ok');
    expect(typeof getRaiseModeColor === 'function').toBeTruthy();
  });
});
