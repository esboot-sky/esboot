import { getPageI18n } from '@/helpers/import-locales';
import App from '@mobile/modules/index';
import enUS from '@mobile/modules/index/locales/en-US.json';
import zhCN from '@mobile/modules/index/locales/zh-CN.json';
import zhTW from '@mobile/modules/index/locales/zh-TW.json';
import { store } from '@mobile/modules/index/model/store';
import generatePage from '@mobile-native/helpers/generate-page';

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
