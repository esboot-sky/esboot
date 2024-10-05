import loadable from '@loadable/component';
import { createBrowserRouter } from 'react-router-dom';

import App from './app';
import HomeRouters from '@/views/home/router';

const Login = loadable(() => import('@/views/login/app'));
const NotFound = loadable(() => import('@/views/misc/not-found/not-found'));

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <App />,
    children: HomeRouters,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
