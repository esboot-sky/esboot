import App from '@pc/modules/test';
import generatePage from '@pc-browser/helpers/generate-page';

generatePage(<App />);

export default {
  title: 'pc-browser',
  template: 'disable-rem',
  langJsonPicker: ['test', 'global'],
};
