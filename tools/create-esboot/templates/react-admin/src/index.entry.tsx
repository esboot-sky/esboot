import { StrictMode, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import wrapI18n from './hoc/i18n';
import wrapPermission from './hoc/wrap-permissions';
import { useAppStore } from './model/app';
import getRouter from './router';
import { getRouterBasename, isQiankun } from './utils/qiankun';

import '@/styles/index.scss';

let root: ReactDOM.Root | null = null;

function render(props: any = {}) {
  const { container, routerBase, getCurrentGlobalState } = props;

  if (isQiankun && getCurrentGlobalState) {
    const mainAppState = getCurrentGlobalState();
    if (mainAppState) {
      const store = useAppStore.getState();
      if (mainAppState.token) store.setToken(mainAppState.token);
      if (mainAppState.currentModule) store.setCurrentModule(mainAppState.currentModule);
      if (mainAppState.language) store.setLang(mainAppState.language);
      if (mainAppState.currentModule?.permission) {
        store.setCurrentPermissionList(mainAppState.currentModule.permission);
      }
    }
  }

  const targetContainer = container
    ? (container.querySelector('#root') as Element) || container
    : (document.getElementById('root') as Element);

  const basename = getRouterBasename(routerBase);

  const App = () => {
    const currentModuleMenu = useAppStore(state => state.currentModule?.menu);
    const router = useMemo(
      () => getRouter(currentModuleMenu, basename),
      [currentModuleMenu],
    );
    return <RouterProvider router={router} />;
  };

  let app: React.ReactNode = wrapI18n(<App />, true);
  app = wrapPermission(app);

  if (!root) {
    root = ReactDOM.createRoot(targetContainer);
  }
  root.render(<StrictMode>{app}</StrictMode>);
}

if (!isQiankun) {
  render({});
}

export async function bootstrap() {
  console.log('[qiankun] esboot-react-admin bootstrap');
}

export async function mount(props: any) {
  console.log('[qiankun] esboot-react-admin mount', props);
  render(props);
}

export async function unmount() {
  console.log('[qiankun] esboot-react-admin unmount');
  if (root) {
    root.unmount();
    root = null;
  }
}

export default {
  title: '点证管理中台',
};
