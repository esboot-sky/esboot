import generatePage from '@/helpers/generate-page';

import App from './quotes-package-auto-renew-agreement';

generatePage(<App />, {
  isEncrypt: false,
});

export default {
  title: ' ',
  langJsonPicker: ['quotes-package-auto-renew-agreement'],
};
