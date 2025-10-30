import { flattenLangObject } from '@dz-web/esboot-browser';

import generatePage from '@/helpers/generate-page';
import globalZhHans from '@/lang/zh-CN.json';
import globalZhHant from '@/lang/zh-TW.json';

import { useQuotationStore } from '../../model/store';

import zhHans from './lang/zh-hans';
import zhHant from './lang/zh-hant';
import App from './quotes-package-details';

const mergedZhHans = { ...flattenLangObject(globalZhHans), ...zhHans };
const mergedZhHant = { ...flattenLangObject(globalZhHant), ...zhHant };

generatePage(<App />, {
  store: useQuotationStore,
  i18n: { messageDict: { 'zh-TW': mergedZhHant, 'zh-CN': mergedZhHans } },
  isEncrypt: false,
});

export default {
  title: ' ',
  langJsonPicker: ['global'],
};
