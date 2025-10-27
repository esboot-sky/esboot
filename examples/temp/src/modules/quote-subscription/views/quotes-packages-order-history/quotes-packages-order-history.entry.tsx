import generatePage from '@/helpers/generate-page';

import mergedZhHans from './lang/zh-hans';
import mergedZhHant from './lang/zh-hant';
import App from './quotes-packages-order-history';

generatePage(<App />, {
  isEncrypt: false,
  i18n: { messageDict: { 'zh-TW': mergedZhHant, 'zh-CN': mergedZhHans, 'en-US': {} } },
});

export default {
  title: ' ',
};
