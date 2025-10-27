import { Toast } from 'antd-mobile';
import { ReactNode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { scan } from 'react-scan';

import ErrorBoundary from '@/components/error-boundary/error-boundary';
import { enableReactScan } from '@/constants/config';
import { bridge, initBridge } from '@/helpers/native/bridge';
import { fullscreen, changeUserStatus } from '@/helpers/native/msg';
import { onPageHide, onPageShow } from '@/helpers/native/register';
import { wrapReactQuery } from '@/hoc/query-client';
import { useAppStore } from '@/model/app';
import '@/styles/index.scss';
import { listenLoginExpired } from '@/utils/global-events';

import wrapI18n, { type I18nProps } from './entry/i18n';
import wrapNative from './entry/native';
import wrapQuotePermissions from './entry/quote-permissions';
import staticConfig from './static-config';

const enableDebug = !!staticConfig.getConfig('debug');
if (enableDebug) {
  import('eruda').then((eruda) => eruda.default.init());
}

interface IOptions {
  store?: any;
  native?: boolean;
  i18n?: I18nProps;
  initOptions?: any;
  isEncrypt?: boolean;
  needQuote?: boolean;
  needQuotePermissions?: boolean;
  isFullScreen?: boolean;
}

function mounte(native: boolean, innerApp: any, isFullScreen: boolean) {
  if (enableReactScan) {
    scan({
      enabled: enableReactScan,
      showToolbar: true,
      showFPS: true,
    });
  }

  if (native) {
    bridge.ready(() => {
      createRoot(document.getElementById('root')!).render(innerApp);

      if (isFullScreen) {
        console.log('fullscreen', isFullScreen);
        fullscreen();
      }
    });
  } else {
    createRoot(document.getElementById('root')!).render(innerApp);
  }
}

function _getRootFontSize() {
  console.log('document.documentElement.style.fontSize', document.documentElement.style.fontSize);
  return (document.documentElement.style.fontSize || '').replace('px', '');
}

function Wrapper({ children }: { children: ReactNode }) {
  const [width, setWidth] = useState(window.innerWidth);
  const [rootFontSize, setRootFontSize] = useState(() => _getRootFontSize());
  const setIsLogin = useAppStore((state) => state.setIsLogin);
  const setIsPageActive = useAppStore((state) => state.setIsPageActive);

  useEffect(() => {
    // 目前使用的android webview刚打开时window size为0，这时候渲染界面会导致很多代码崩溃异常
    console.log('window size: ', window.innerWidth, window.innerHeight);

    window.addEventListener('resize', () => {
      setWidth(window.innerWidth);
    });

    return () => {
      window.removeEventListener('resize', () => {});
    };
  }, []);

  useEffect(() => {
    // 目前使用的android webview刚打开时h5加载太快，取到的fontSize为undefined，这时候计算出来的缩放比例不对，会导致用到ratio计算的代码如表格行高为0显示不出来，并且计算好几千行因子库数据
    function tryGetRootFontSize() {
      if (rootFontSize) return;

      const fontSize = _getRootFontSize();
      if (fontSize) {
        setRootFontSize(fontSize);
      } else {
        // 一直获取直到获取到字体大小才实际显示页面
        setTimeout(tryGetRootFontSize, 10);
      }
    }

    tryGetRootFontSize();
  }, []);

  useEffect(() => {
    const cancel = onPageShow(() => {
      setIsPageActive(true);
    });

    return cancel;
  }, []);

  useEffect(() => {
    const cancel = onPageHide(() => {
      setIsPageActive(false);
    });

    return cancel;
  }, []);

  useEffect(() => {
    listenLoginExpired((data) => {
      const message = data.message.replace(/^【.*】/, '');
      setIsLogin(false);
      Toast.show(message);
      changeUserStatus({ message });
    });
  }, []);

  if (width > 0 && rootFontSize) {
    return children;
  }

  return null;
}

export default async function generatePage(App: any, options: IOptions = {}): Promise<void> {
  const {
    native = true,
    i18n = true as I18nProps,
    needQuote = false,
    needQuotePermissions = false,
    isFullScreen = false,
  } = options;
  App = (
    <ErrorBoundary>
      <Wrapper>{App}</Wrapper>
    </ErrorBoundary>
  );

  await initBridge();

  if (needQuotePermissions) App = wrapQuotePermissions(App);
  if (i18n) App = wrapI18n(App, i18n);
  if (native) App = wrapNative(App, needQuote);
  App = wrapReactQuery(App);

  mounte(native, App, isFullScreen);
}
