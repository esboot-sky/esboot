import type { GeneratePageOptions } from '@/types';
import wrapBrowser from '@pc-browser/hoc/browser';
import { TopErrorBoundaryFallback } from '@pc/components/top-error-boundary-fallback';
import wrapI18n from '@pc/hoc/i18n';
import { subscribeUserAndCache } from '@pc/model/subscriber';
import { mounteReact } from '@/helpers/react';
import { wrapReactQuery } from '@/hoc/query-client';
import { wrapRedux } from '@/hoc/redux';
import { wrapTopErrorBoundary } from '@/hoc/top-error-boundary';
import 'rsuite/dist/rsuite.min.css';
import '@/styles/index.scss';
import '@pc/styles/index.scss';

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
