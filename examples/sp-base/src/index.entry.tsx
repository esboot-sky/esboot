import { createExternalConsole } from '@dz-web/esboot-browser';
import { ErrorBoundary, monitorPerformance } from '@dz-web/esboot-browser-react';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import router from './router';

import '@/styles/index.scss';

monitorPerformance();
createExternalConsole({ enabled: true });
ReactDOM.createRoot(document.getElementById('root') as Element).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} fallbackElement={<div>*</div>} />
    </ErrorBoundary>
  </StrictMode>,
);

export default {
  title: 'SP Base',
};
