import { bridge, BridgePlatforms } from '@dz-web/bridge';
import { mounteReact } from '@/helpers/react';
import { useBridgeMock } from '@/constants/config';

import wrapI18n from '@mobile/hoc/i18n';
import { wrapRedux } from '@/hoc/redux';
import { subscribeUserAndCache } from '@mobile/model/subscriber';
import { wrapReactQuery } from '@/hoc/query-client';
import wrapNative from '@mobile-native/hoc/native';
import { wrapTopErrorBoundary } from '@/hoc/top-error-boundary';
import { GeneratePageOptions } from '@/types';

import '@/styles/index.scss';
import '@mobile/styles/index.scss';
import { TopErrorBoundaryFallback } from '@mobile/components/top-error-boundary-fallback';

export default function generatePage(App: React.ReactNode, options: GeneratePageOptions): void {
  const { i18n, store } = options;
  let wrapApp: React.ReactNode = App;

  bridge.initPlatforms(useBridgeMock ? BridgePlatforms.mock : BridgePlatforms.webview);
  wrapApp = wrapNative(wrapApp);
  wrapApp = wrapReactQuery(wrapApp);

  wrapApp = wrapTopErrorBoundary(wrapApp, TopErrorBoundaryFallback);
  wrapApp = wrapI18n(wrapApp, i18n);
  wrapApp = wrapRedux(wrapApp, store);
  bridge.ready(() => {
    mounteReact(wrapApp as React.ReactElement);
  });

  subscribeUserAndCache(store);
}
