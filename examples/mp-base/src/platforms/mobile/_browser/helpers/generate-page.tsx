import { mounteReact } from '@/helpers/react';
import { wrapReactQuery } from '@/hoc/query-client';
import { wrapRedux } from '@/hoc/redux';
import { wrapTopErrorBoundary } from '@/hoc/top-error-boundary';
import '@/styles/index.scss';
import { TopErrorBoundaryFallback } from '@mobile/components/top-error-boundary-fallback';
import '@mobile/helpers/v-console';
import wrapI18n from '@mobile/hoc/i18n';
import { subscribeUserAndCache } from '@mobile/model/subscriber';
import '@mobile/styles/index.scss';
import wrapBrowser from '@mobile-browser/hoc/browser';

import type { GeneratePageOptions } from '@/types';

export default function generatePage(App: React.ReactNode, options: GeneratePageOptions): void {
  const { i18n, store, disableStrictMode } = options;
  let wrapApp: React.ReactNode = App;

  wrapApp = wrapBrowser(wrapApp);
  wrapApp = wrapReactQuery(wrapApp);

  wrapApp = wrapTopErrorBoundary(wrapApp, TopErrorBoundaryFallback);
  wrapApp = wrapI18n(wrapApp, i18n);
  wrapApp = wrapRedux(wrapApp, store);
  mounteReact(wrapApp as React.ReactElement, disableStrictMode);

  subscribeUserAndCache(store);
}
