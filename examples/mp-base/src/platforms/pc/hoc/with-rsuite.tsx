import { ReactNode, useLayoutEffect } from 'react';
import { CustomProvider } from 'rsuite';
import 'rsuite/dist/rsuite-no-reset.min.css';
import zhCN from 'rsuite/locales/zh_CN';

// import { useLanguage } from '@pc/hooks/use-language';
import { SupportedThemes } from '@pc/constants/config';
import { useUserConfig } from '@pc/hooks/use-user-config';

export function withRSuite(App): any {
  return function RSuiteApp({ ...rest }) {
    // const language = useLanguage();
    const {
      userConfig: { theme },
    } = useUserConfig();

    const rsuiteTheme = theme === SupportedThemes.light ? 'light' : 'dark';

    useLayoutEffect(() => {
      if (theme === SupportedThemes.dark && !document.body.classList.contains('rs-theme-dark')) {
        document.body.classList.add(`rs-theme-${rsuiteTheme}`);
      }
    }, []);

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
