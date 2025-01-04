import App from '@mobile/modules/test';
import { store } from '@mobile/modules/test/model/store';
import generatePage from '@mobile-native/helpers/generate-page';

generatePage(<App />, {
  store,
});

export default {
  title: 'Mobile-Native',
  langJsonPicker: ['test', 'global'],
};
