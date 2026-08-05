import type { IMenu } from './model/app';
import loadable from '@loadable/component';
import { useEffect } from 'react';

import { createBrowserRouter, Outlet, useLocation, useNavigate } from 'react-router-dom';

import Home from '@/modules/home/app';
import App from './app';
import { useAppStore } from './model/app';
import { filterRoutesByMenu } from './router-utils';
import { transformToMenuItems } from './utils/menu';

const Login = loadable(() => import('./modules/login/app'));
const NotFound = loadable(() => import('./modules/misc/not-found/not-found'));
const UserManagement = loadable(() => import('./modules/user-management/user-management'));
const RoleManagement = loadable(() => import('./modules/role-management/role-management'));

const HOME_CHILD_ROUTE_DEFINITIONS = [
  {
    path: 'account-management-center/user-management',
    element: <UserManagement />,
  },
  {
    path: 'account-management-center/role-management',
    element: <RoleManagement />,
  },
];

// eslint-disable-next-line react-refresh/only-export-components
function RouterShell() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = useAppStore(state => state.token);
  const currentModule = useAppStore(state => state.currentModule);
  const currentModulePath = useAppStore(state => state.currentModulePath);
  const setCurrentModulePath = useAppStore(state => state.setCurrentModulePath);

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    if (location.pathname === '/') {
      const navList = transformToMenuItems(currentModule?.menu);
      if (!navList.length || !navList[0]?.path)
        return;

      const { path } = navList[0];
      setCurrentModulePath(path);
      navigate(path);
      return;
    }

    if (location.pathname === currentModulePath)
      return;

    setCurrentModulePath(location.pathname);
  }, [token, location.pathname, currentModule?.menu, currentModulePath, navigate, setCurrentModulePath]);

  return <Outlet />;
}

export function getRouter(menuItems?: IMenu[], basename?: string) {
  const homeChildRoutes = filterRoutesByMenu(HOME_CHILD_ROUTE_DEFINITIONS, menuItems);

  const HomeRoutes = {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Home />,
        children: homeChildRoutes,
      },
    ],
  };

  return createBrowserRouter(
    [
      {
        path: '/',
        element: <RouterShell />,
        children: [
          {
            path: 'login',
            element: <Login />,
          },
          HomeRoutes,
          {
            path: '*',
            element: <NotFound />,
          },
        ],
      },
    ],
    { basename },
  );
}

export default getRouter;
