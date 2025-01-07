import App from '@pc/modules/test2';
import { store } from '@pc/modules/test2/model/store';
import generatePage from '@pc-browser/helpers/generate-page';

generatePage(<App />, {
  store,
});

export default {
  title: 'test2',
  template: 'disable-rem',
  langJsonPicker: ['test2', 'global'],
};
