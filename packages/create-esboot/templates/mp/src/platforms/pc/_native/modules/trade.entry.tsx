import generatePage from '@pc-native/helpers/generate-page';

import zhCN from '@pc/modules/trade/locales/zh-CN.json';
import zhTW from '@pc/modules/trade/locales/zh-TW.json';
import enUS from '@pc/modules/trade/locales/en-US.json';

import App from '@pc/modules/trade';
import { store } from '@pc/modules/trade/model/store';
import { getPageI18n } from '@/helpers/import-locales';

generatePage(<App />, {
  store,
  i18n: getPageI18n({
    'zh-CN': zhCN,
    'zh-TW': zhTW,
    'en-US': enUS,
  }),
});

export default {
  title: 'pc-Native',
};
