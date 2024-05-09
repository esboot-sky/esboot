import { getPageI18n } from '@/helpers/import-locales';
import App from '@pc/modules/index';
import enUS from '@pc/modules/index/locales/en-US.json';
import zhCN from '@pc/modules/index/locales/zh-CN.json';
import zhTW from '@pc/modules/index/locales/zh-TW.json';
import { store } from '@pc/modules/index/model/store';
import generatePage from '@pc-native/helpers/generate-page';

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
  template: 'disable-rem',
};
