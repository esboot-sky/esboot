import { bridge, BridgePlatforms } from '@dz-web/bridge';
import { mounteReact } from '@/helpers/react';
import { useBridgeMock } from '@/constants/config';

import wrapNative from './hoc/native';
import wrapI18n, { I18nOption } from './hoc/i18n';
import wrapAntd from './hoc/antd';

import '@/styles/index.scss';
import '@pc/styles/index.scss';

interface IOptions {
  store?: any;
  native?: boolean;
  i18n?: I18nOption;
  antd?: boolean;
  quote?: boolean;
}

function mounte(native: boolean, innerApp: React.ReactElement) {
  if (native) {
    bridge.ready(() => {
      mounteReact(innerApp);
    });
  } else {
    mounteReact(innerApp);
  }
}

export default function generatePage(wrapApp: React.ReactNode, options: IOptions = {}): void {
  const { native = true, i18n, antd = true } = options;

  if (i18n) wrapApp = wrapI18n(wrapApp, i18n);

  console.log(process.env.NODE_ENV);

  if (native) {
    bridge.initPlatforms(useBridgeMock ? BridgePlatforms.mock : BridgePlatforms.pc);

    wrapApp = wrapNative(wrapApp);
  }

  if (antd) wrapApp = wrapAntd(wrapApp);

  mounte(native, wrapApp as React.ReactElement);
}