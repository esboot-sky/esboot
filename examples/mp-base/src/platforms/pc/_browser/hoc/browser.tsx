import type { ComponentPropsWithoutRef, FC, ReactNode } from 'react';

import { supportedThemes } from '@pc/constants/config';
import { setTheme, usePCStore } from '@pc/model/pc';
import { useEffect } from 'react';

export function withBrowser(Component: FC<any>) {
  return function NativeApp(props: ComponentPropsWithoutRef<typeof Component>) {
    const followSystemPrefersColorSchemeWhenInBrowser = usePCStore(state =>
      state.userConfig.followSystemPrefersColorSchemeWhenInBrowser);

    useEffect(() => {
      if (!followSystemPrefersColorSchemeWhenInBrowser)
        return () => { };

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
