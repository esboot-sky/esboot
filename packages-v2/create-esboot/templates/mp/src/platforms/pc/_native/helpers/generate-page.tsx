import { bridge, BridgePlatforms } from '@dz-web/bridge';
import { mounteReact } from '@/helpers/react';
import { useBridgeMock } from '@/constants/config';

import wrapI18n from '@pc/hoc/i18n';
import { wrapRedux } from '@/hoc/redux';
import { subscribeUserAndCache } from '@pc/model/subscriber';
import { wrapReactQuery } from '@/hoc/query-client';
import wrapNative from '@pc-native/hoc/native';

import '@/styles/index.scss';
import '@pc/styles/index.scss';
import { wrapTopErrorBoundary } from '@/hoc/top-error-boundary';
import { TopErrorBoundaryFallback } from '@pc/components/top-error-boundary-fallback';
import { GeneratePageOptions } from '@/types';

export default function generatePage(App: React.ReactNode, options: GeneratePageOptions): void {
  const { i18n, store } = options;
  let wrapApp: React.ReactNode = App;

  bridge.initPlatforms(useBridgeMock ? BridgePlatforms.mock : BridgePlatforms.pc);
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
