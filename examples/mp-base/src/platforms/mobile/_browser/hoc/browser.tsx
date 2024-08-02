/**
 * 此文件为项目标准格式，禁止修改，需要修改请联系负责人进行迭代
 */
import { FC, ComponentPropsWithoutRef, ReactNode, useEffect } from 'react';

import { SupportedThemes } from '@mobile/constants/config';
import { useUserConfig } from '@mobile/hooks/use-user-config';

export function withBrowser(Component: FC<any>) {
  return function NativeApp(props: ComponentPropsWithoutRef<typeof Component>) {
    const { userConfig, setTheme } = useUserConfig();

    useEffect(() => {
      if (!userConfig.followSystemPrefersColorSchemeWhenInBrowser) return () => {};

      const darkThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const onThemeChange = (e: MediaQueryListEvent) => {
        const isDarkThemeEnabled = e.matches;
        setTheme(isDarkThemeEnabled ? SupportedThemes.dark : SupportedThemes.light);
      };

      darkThemeQuery.addEventListener('change', onThemeChange);

      return () => {
        darkThemeQuery.removeEventListener('change', onThemeChange);
      };
    }, [userConfig.followSystemPrefersColorSchemeWhenInBrowser]);

    return <Component {...props} />;
  };
}

export default function wrapBrowser(App: ReactNode): React.ReactNode {
  const WrappedComponent = withBrowser(() => App);
  return <WrappedComponent />;
}
