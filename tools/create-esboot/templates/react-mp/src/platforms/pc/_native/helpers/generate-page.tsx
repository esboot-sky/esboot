import type { GeneratePageOptions } from '@/types';

import { bridge } from '@dz-web/bridge';
import wrapNative from '@pc-native/hoc/native';
import { TopErrorBoundaryFallback } from '@pc/components/top-error-boundary-fallback';
import { subscribeUserAndCache } from '@pc/model/subscriber';
import { useBridgeMock } from '@/constants/config';
import { mounteReact } from '@/helpers/react';
import wrapI18n from '@/hoc/i18n';
import { wrapReactQuery } from '@/hoc/query-client';
import { wrapTopErrorBoundary } from '@/hoc/top-error-boundary';
import '@/styles/index.scss';
import '@pc/styles/index.scss';

export default async function generatePage(App: React.ReactNode, options?: GeneratePageOptions): Promise<void> {
  const { i18n = true, disableStrictMode = false, disabledLoginExpired = false } = options || {};
  let wrapApp: React.ReactNode = App;

  if (useBridgeMock) {
    const mockbridge = await import('@dz-web/bridge/platforms/mock');
    bridge.init(mockbridge.createBridge());
  }
  else {
    const pcbridge = await import('@dz-web/bridge/platforms/pc');
    bridge.init(pcbridge.createBridge());
  }

  wrapApp = wrapNative(wrapApp, {
    disabledLoginExpired,
  });
  wrapApp = wrapReactQuery(wrapApp);

  wrapApp = wrapTopErrorBoundary(wrapApp, TopErrorBoundaryFallback);
  wrapApp = wrapI18n(wrapApp, i18n);
  bridge.ready(() => {
    mounteReact(wrapApp as React.ReactElement, disableStrictMode);
  });

  subscribeUserAndCache();
}
