import App from '@pc/modules/test2';
import { store } from '@pc/modules/test2/model/store';
import generatePage from '@pc-native/helpers/generate-page';

generatePage(<App />, {
  store,
});

export default {
  title: 'pc-Native',
  template: 'disable-rem',
  langJsonPicker: ['test2', 'global'],
};
