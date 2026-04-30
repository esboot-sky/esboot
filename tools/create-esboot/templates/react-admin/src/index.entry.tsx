import { StrictMode, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import wrapI18n from './hoc/i18n';

import wrapPermission from './hoc/wrap-permissions';
import { useAppStore } from './model/app';
import getRouter from './router';
import '@/styles/index.scss';

function render() {
  const container = document.getElementById('root') as Element;

  const App = () => {
    const currentModuleMenu = useAppStore(state => state.currentModule?.menu);
    const router = useMemo(() => getRouter(currentModuleMenu), [currentModuleMenu]);
    return <RouterProvider router={router} />;
  };

  let app: React.ReactNode = wrapI18n(<App />, true);
  app = wrapPermission(app);

  ReactDOM.createRoot(container).render(<StrictMode>{app}</StrictMode>);
}

render();

export default {
  title: '点证管理中台',
};
