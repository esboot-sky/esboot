import { mounteReact } from '@/helpers/react';

import wrapI18n from '@pc/hoc/i18n';
import { wrapRedux } from '@/hoc/redux';
import { wrapReactQuery } from '@/hoc/query-client';

import '@/styles/index.scss';
import '@pc/styles/index.scss';
import '@/helpers/browser/init-page-query';
import { I18nOption } from '@/types';
import { subscribeUserAndCache } from '@pc/model/subscriber';
import wrapBrowser from '@pc-browser/hoc/browser';

interface GeneratePageOptions {
  store: any;
  i18n?: I18nOption;
}

export default function generatePage(App: React.ReactNode, options: GeneratePageOptions): void {
  const { i18n, store } = options;
  let wrapApp: React.ReactNode = App;

  if (i18n) wrapApp = wrapI18n(wrapApp, i18n);

  wrapApp = wrapBrowser(wrapApp);

  wrapApp = wrapReactQuery(wrapApp);
  wrapApp = wrapRedux(wrapApp, store);
  mounteReact(wrapApp as React.ReactElement);

  subscribeUserAndCache(store);
}
