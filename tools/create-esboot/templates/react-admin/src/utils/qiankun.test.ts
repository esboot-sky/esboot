import { expect, it } from 'vitest';
import { getRouterBasename, isQiankunEnv } from './qiankun';

it('isQiankunEnv detects window.__POWERED_BY_QIANKUN__', () => {
  expect(isQiankunEnv()).toBe(false);

  (window as any).__POWERED_BY_QIANKUN__ = true;
  expect(isQiankunEnv()).toBe(true);

  delete (window as any).__POWERED_BY_QIANKUN__;
});

it('getRouterBasename resolves dynamically without hardcoding', () => {
  expect(getRouterBasename('/custom-base')).toBe('/custom-base');
  expect(getRouterBasename(undefined)).toBe('/');

  (window as any).__POWERED_BY_QIANKUN__ = true;
  delete (window as any).location;
  (window as any).location = { pathname: '/child-system/user' };
  expect(getRouterBasename()).toBe('/child-system');

  delete (window as any).__POWERED_BY_QIANKUN__;
});
