import { expect, it } from 'vitest';

import { buildMicroApps, resolveEntryUrl } from './shared';

it('buildMicroApps filters hidden apps and uses dev entry in development', () => {
  const microApps = buildMicroApps(
    {
      visible: {
        entryUrl: {
          dev: '//localhost:11111',
          prod: '/visible/',
        },
        routerBase: '/child-visible',
        icon: 'menu-visible',
        activeIcon: 'menu-visible-active',
      },
      hidden: {
        entryUrl: {
          dev: '//localhost:11112',
          prod: '/hidden/',
        },
        routerBase: '/child-hidden',
        icon: 'menu-hidden',
        activeIcon: 'menu-hidden-active',
        isHidden: true,
      },
    },
    () => ({
      token: 'token',
    }),
    'development',
  );

  expect(microApps).toHaveLength(1);
  expect(microApps[0]).toMatchObject({
    name: 'visible',
    entry: '//localhost:11111',
    activeRule: expect.any(Function),
    container: '#subapp-viewport',
    props: {
      routerBase: '/child-visible',
      getCurrentGlobalState: expect.any(Function),
    },
  });
});

it('resolveEntryUrl returns prod path outside development', () => {
  expect(resolveEntryUrl('//localhost:11111', '/visible/', 'production')).toBe('/visible/');
});
