import { lazy } from 'react';
import { createHashRouter } from 'react-router';

import demoRouters from './modules/demo/router';

const App = lazy(() => import('./app'));
const NotFound = lazy(() => import('./modules/misc/not-found/not-found'));

const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [demoRouters],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
