import generatePage from '@pc-browser/helpers/generate-page';

import zhCN from '@pc/modules/trade/locales/zh-CN.json';
import zhTW from '@pc/modules/trade/locales/zh-TW.json';
import enUS from '@pc/modules/trade/locales/en-US.json';

import App from '@pc/modules/router-demo';
import { store } from '@pc/modules/router-demo/model/store';
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
  title: 'Mobile-Browser',
};
