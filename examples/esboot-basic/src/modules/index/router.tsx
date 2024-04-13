import loadable from '@loadable/component';
import { createHashRouter } from 'react-router-dom';

import demoRouters from '../demo/router';

import App from './app';

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
