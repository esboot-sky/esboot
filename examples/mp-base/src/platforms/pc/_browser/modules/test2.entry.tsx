import App from '@pc/modules/test2';
import { store } from '@pc/modules/test2/model/store';
import generatePage from '@pc-browser/helpers/generate-page';

generatePage(<App />, {
  store,
});

export default {
  title: 'pc-browser',
  template: 'disable-rem',
  langJsonPicker: ['test2', 'global'],
};
