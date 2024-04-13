import { createHashRouter } from 'react-router-dom';
import loadable from '@loadable/component';
import { listenLoginExpired } from '@/global-events';

import Index from './pages/index';
import Detail from './pages/detail/detail';

const NotFound = loadable(() => import('./pages/not-found/not-found'));

const router = createHashRouter([
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/detail',
    element: <Detail />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

/**
 * 不同页面有不同的路由实例，统一导出到window.__router__，使用页面当前的路由实例
 */
window.__router__ = router;

export default router;

listenLoginExpired(() => {
  console.log('spa 登录过期, 退出登录并跳转到登录页');
});
