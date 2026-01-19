import type { GeneratePageOptions } from '@/types';
import wrapBrowser from '@pc-browser/hoc/browser';
import { TopErrorBoundaryFallback } from '@pc/components/top-error-boundary-fallback';
import { subscribeUserAndCache } from '@pc/model/subscriber';
import { mounteReact } from '@/helpers/react';
import wrapI18n from '@/hoc/i18n';
import { wrapReactQuery } from '@/hoc/query-client';
import { wrapTopErrorBoundary } from '@/hoc/top-error-boundary';
import '@/styles/index.scss';
import '@pc/styles/index.scss';

export default function generatePage(App: React.ReactNode, options?: GeneratePageOptions): void {
  const { i18n = true, disableStrictMode = false } = options || {};
  let wrapApp: React.ReactNode = App;

  wrapApp = wrapBrowser(wrapApp);
  wrapApp = wrapReactQuery(wrapApp);

  wrapApp = wrapTopErrorBoundary(wrapApp, TopErrorBoundaryFallback);
  wrapApp = wrapI18n(wrapApp, i18n);
  mounteReact(wrapApp as React.ReactElement, disableStrictMode);

  subscribeUserAndCache();
}
