import { lazy } from 'react';
import { createHashRouter } from 'react-router';

const App = lazy(() => import('./app'));
const NotFound = lazy(() => import('./modules/misc/not-found/not-found'));

const router = createHashRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
