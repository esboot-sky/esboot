import generatePage from '@/helpers/generate-page';

import App from './app';

generatePage(<App />, {
  isEncrypt: false,
});

export default {
  title: ' ',
  langJsonPicker: ['us-stock-quotes', 'questionnaire-items'],
};
