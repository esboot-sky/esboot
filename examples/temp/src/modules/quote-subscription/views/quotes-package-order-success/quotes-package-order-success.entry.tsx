import generatePage from '@/helpers/generate-page';

import App from './quotes-package-order-success';

generatePage(<App />, {
  isFullScreen: true,
  isEncrypt: false,
});

export default {
  title: ' ',
  langJsonPicker: ['quotes-package-order-success'],
};
