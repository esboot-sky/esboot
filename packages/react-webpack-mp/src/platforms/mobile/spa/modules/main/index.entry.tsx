import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import '@/global-css/main.scss';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { store } from '@/model/store';

import RouterApp from './router';

ReactDOM.render(
  <Provider store={store}>
    <StrictMode>
      <Router>
        <RouterApp />
      </Router>
    </StrictMode>
  </Provider>,
  document.getElementById('root'),
);

export default {
  title: 'React-webpack-mp',
};
