import type { ReactNode } from 'react';
// import { useLanguage } from '@pc/hooks/use-language';
import { supportedThemes } from '@pc/constants/config';
import { usePCStore } from '@pc/model/pc';
import { useLayoutEffect } from 'react';
import { CustomProvider } from 'rsuite';

import zhCN from 'rsuite/locales/zh_CN';
import 'rsuite/dist/rsuite-no-reset.min.css';

export function withRSuite(App: React.ComponentType<any>): React.ComponentType<any> {
  return function RSuiteApp({ ...rest }) {
    const theme = usePCStore(state => state.userConfig.theme);

    const rsuiteTheme = theme === supportedThemes.light ? 'light' : 'dark';

    useLayoutEffect(() => {
      if (theme === supportedThemes.dark && !document.body.classList.contains('rs-theme-dark')) {
        document.body.classList.add(`rs-theme-${rsuiteTheme}`);
      }
    }, [theme]);

    return (
      // 暂时只需要中文
      <CustomProvider theme={rsuiteTheme} locale={zhCN}>
        <App {...rest} />
      </CustomProvider>
    );
  };
}

export function wrapRSuite(element: ReactNode) {
  const App = withRSuite(() => element);

  return <App />;
}
