import { lazy } from 'react';

const App = lazy(() => import('./app'));

export default {
  path: '/demo',
  element: <App />,
};
