import App from '@pc/modules/test';
import generatePage from '@pc-native/helpers/generate-page';

generatePage(<App />);

export default {
  title: 'pc-Native',
  template: 'disable-rem',
  langJsonPicker: ['test', 'global'],
};
