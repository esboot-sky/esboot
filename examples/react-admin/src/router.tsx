import loadable from '@loadable/component';
import { useEffect } from 'react';
import { Outlet, createBrowserRouter, useLocation, useNavigate } from 'react-router-dom';

import Home from '@/modules/home/app';

import App from './app';
import { useAppStore } from './model/app';
import { transformToMenuItems } from './utils/menu';

const Login = loadable(() => import('./modules/login/app'));
const NotFound = loadable(() => import('./modules/misc/not-found/not-found'));
const UserManagement = loadable(() => import('./modules/user-management/user-management'));
const RoleManagement = loadable(() => import('./modules/role-management/role-management'));

type MenuNode = {
  path?: string;
  children?: MenuNode[];
};

const RouterShell = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = useAppStore((state) => state.token);
  const currentModule = useAppStore((state) => state.currentModule);
  const currentModulePath = useAppStore((state) => state.currentModulePath);
  const setCurrentModulePath = useAppStore((state) => state.setCurrentModulePath);

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    if (location.pathname === '/') {
      const navList = transformToMenuItems(currentModule?.menu);
      if (!navList.length || !navList[0]?.path) return;

      const { path } = navList[0];
      setCurrentModulePath(path);
      navigate(path);
      return;
    }

    if (location.pathname === currentModulePath) return;

    setCurrentModulePath(location.pathname);
  }, [token, location.pathname]);

  return <Outlet />;
};

const getAllPathsFromMenu = (menuItems?: MenuNode[]) => {
  let paths: string[] = [];

  menuItems?.forEach((item: MenuNode) => {
    if (item.path) {
      paths.push(item.path);
    }
    if (item.children && item.children.length > 0) {
      paths = paths.concat(getAllPathsFromMenu(item.children));
    }
  });

  return paths;
};

const getRouter = () => {
  const allHomeChildRoutes = [
    {
      path: 'account-management-center/user-management',
      element: <UserManagement />,
    },
    {
      path: 'account-management-center/role-management',
      element: <RoleManagement />,
    },
  ];

  const { currentModule } = useAppStore.getState();

  const menuPaths = getAllPathsFromMenu(currentModule?.menu);
  const HomeChildRoutes = allHomeChildRoutes.filter((route) => menuPaths.includes(`/${route.path}`));

  const HomeRoutes = {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Home />,
        children: HomeChildRoutes,
      },
    ],
  };

  return createBrowserRouter([
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
  ]);
};

export default getRouter;
