import { ErrorBoundary } from '@dz-web/esboot-browser-react';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import router from './router';

import '@/styles/index.scss';

ReactDOM.createRoot(document.getElementById('root') as Element).render(
  <StrictMode>
    <ErrorBoundary test={1}>
      <RouterProvider router={router} fallbackElement={<div>*</div>} />
    </ErrorBoundary>
  </StrictMode>,
);

export default {
  title: 'SP Base',
};
