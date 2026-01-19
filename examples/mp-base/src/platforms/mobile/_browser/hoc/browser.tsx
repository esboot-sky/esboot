/**
 * 此文件为项目标准格式，禁止修改，需要修改请联系负责人进行迭代
 */
import type { ComponentPropsWithoutRef, FC, ReactNode } from 'react';

import { supportedThemes } from '@mobile/constants/config';
import { setTheme, useAppStore } from '@mobile/model/mobile';
import { useEffect } from 'react';

export function withBrowser(Component: FC<any>) {
  return function NativeApp(props: ComponentPropsWithoutRef<typeof Component>) {
    const followSystemPrefersColorSchemeWhenInBrowser = useAppStore(
      state => state.userConfig.followSystemPrefersColorSchemeWhenInBrowser,
    );

    useEffect(() => {
      if (!followSystemPrefersColorSchemeWhenInBrowser)
        return () => {};

      const darkThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const onThemeChange = (e: MediaQueryListEvent) => {
        const isDarkThemeEnabled = e.matches;
        setTheme(isDarkThemeEnabled ? supportedThemes.dark : supportedThemes.light);
      };

      darkThemeQuery.addEventListener('change', onThemeChange);

      return () => {
        darkThemeQuery.removeEventListener('change', onThemeChange);
      };
    }, [followSystemPrefersColorSchemeWhenInBrowser]);

    return <Component {...props} />;
  };
}

export default function wrapBrowser(App: ReactNode): React.ReactNode {
  const WrappedComponent = withBrowser(() => App);
  return <WrappedComponent />;
}
