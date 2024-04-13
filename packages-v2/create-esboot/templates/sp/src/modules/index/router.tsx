import { createHashRouter } from 'react-router-dom';
import loadable from '@loadable/component';

import App from './app';

import demoRouters from '../demo/router';

const NotFound = loadable(() => import('../misc/not-found/not-found'));

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
