import { Suspense, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { HashRouter as Router } from 'react-router-dom';

import Loading from '@/components/loading/loading';
import { settingNavigationTitle } from '@/helpers/native/msg';

import './app.scss';
import { RouterConfig } from './router';

const App = () => {
  const { formatMessage } = useIntl();
  useEffect(() => {
    settingNavigationTitle({ title: formatMessage({ id: 'us-stock-quotes.page_title' }) });
  }, []);
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <RouterConfig />
      </Suspense>
    </Router>
  );
};

export default App;
