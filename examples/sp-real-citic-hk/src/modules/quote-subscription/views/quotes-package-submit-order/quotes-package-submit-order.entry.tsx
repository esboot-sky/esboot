import { flattenLangObject } from '@dz-web/esboot-browser';

import generatePage from '@/helpers/generate-page';
import globalZhHans from '@/lang/zh-CN.json';
import globalZhHant from '@/lang/zh-TW.json';

import { useQuotationStore } from '../../model/store';

import quotesPackageSubmitOrderZhHans from './lang/zh-hans';
import quotesPackageSubmitOrderZhHant from './lang/zh-hant';
import App from './quotes-package-submit-order';

const mergedZhHans = { ...flattenLangObject(globalZhHans), ...quotesPackageSubmitOrderZhHans };
const mergedZhHant = { ...flattenLangObject(globalZhHant), ...quotesPackageSubmitOrderZhHant };
generatePage(<App />, {
  store: useQuotationStore,
  i18n: { messageDict: { 'zh-TW': mergedZhHant, 'zh-CN': mergedZhHans } },
  isEncrypt: true,
});

export default {
  title: ' ',
  langJsonPicker: ['global'],
  // template: 'template/my-mine.html',
};
