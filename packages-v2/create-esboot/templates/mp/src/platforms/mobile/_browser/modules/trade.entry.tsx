import generatePage from '@mobile-browser/helpers/generate-page';

import zhCN from '@mobile/modules/trade/locales/zh-CN.json';
import zhTW from '@mobile/modules/trade/locales/zh-TW.json';
import enUS from '@mobile/modules/trade/locales/en-US.json';

import App from '@mobile/modules/trade';
import { store } from '@mobile/modules/trade/model/store';
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
  title: 'Mobile-Native',
};
