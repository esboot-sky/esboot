import { mounteReact } from '@/helpers/react';

import wrapI18n from '@mobile/hoc/i18n';
import { wrapRedux } from '@/hoc/redux';
import { wrapReactQuery } from '@/hoc/query-client';

import '@/styles/index.scss';
import '@mobile/styles/index.scss';
import { subscribeUserAndCache } from '@mobile/model/subscriber';
import wrapBrowser from '@mobile-browser/hoc/browser';
import { wrapTopErrorBoundary } from '@/hoc/top-error-boundary';
import { GeneratePageOptions } from '@/types';
import { TopErrorBoundaryFallback } from '@mobile/components/top-error-boundary-fallback';

export default function generatePage(App: React.ReactNode, options: GeneratePageOptions): void {
  const { i18n, store } = options;
  let wrapApp: React.ReactNode = App;

  wrapApp = wrapBrowser(wrapApp);
  wrapApp = wrapReactQuery(wrapApp);

  wrapApp = wrapTopErrorBoundary(wrapApp, TopErrorBoundaryFallback);
  wrapApp = wrapI18n(wrapApp, i18n);
  wrapApp = wrapRedux(wrapApp, store);
  mounteReact(wrapApp as React.ReactElement);

  subscribeUserAndCache(store);
}
