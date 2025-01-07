import App from '@pc/modules/test';
import { store } from '@pc/modules/test/model/store';
import generatePage from '@pc-browser/helpers/generate-page';

generatePage(<App />, {
  store,
});

export default {
  title: 'test',
  // template: 'disable-rem',
  langJsonPicker: ['test', 'global'],
};
