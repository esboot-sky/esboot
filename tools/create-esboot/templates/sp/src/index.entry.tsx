import { createExternalConsole } from '@dz-web/esboot-browser';
import { ErrorBoundary, monitorPerformance } from '@dz-web/esboot-browser-react';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router';

import router from './router';

import '@/styles/index.scss';

monitorPerformance();
createExternalConsole();
ReactDOM.createRoot(document.getElementById('root') as Element).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
);

export default {
  title: 'PC Browser',
};
