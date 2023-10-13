import { bridge, BridgePlatforms } from '@dz-web/bridge';
import { mounteReact } from '@/helpers/react';
import { useBridgeMock } from '@/constants/config';

import wrapI18n from '@pc/hoc/i18n';
import { wrapRedux } from '@/hoc/redux';
import { subscribeUserAndCache } from '@pc/model/subscriber';
import { wrapReactQuery } from '@/hoc/query-client';
import { I18nOption } from '@/types';
import wrapNative from '@pc-native/hoc/native';

import '@/styles/index.scss';
import '@pc/styles/index.scss';

interface GeneratePageOptions {
  store: any;
  native?: boolean;
  i18n?: I18nOption;
}

export default function generatePage(App: React.ReactNode, options: GeneratePageOptions): void {
  const { i18n, store } = options;
  let wrapApp: React.ReactNode = App;

  if (i18n) wrapApp = wrapI18n(wrapApp, i18n);
  bridge.initPlatforms(useBridgeMock ? BridgePlatforms.mock : BridgePlatforms.pc);
  wrapApp = wrapNative(wrapApp);

  wrapApp = wrapReactQuery(wrapApp);
  wrapApp = wrapRedux(wrapApp, store);
  bridge.ready(() => {
    mounteReact(wrapApp as React.ReactElement);
  });

  subscribeUserAndCache(store);
}
