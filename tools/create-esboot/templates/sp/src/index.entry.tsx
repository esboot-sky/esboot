import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router';

import '@/styles/index.scss';

import router from './router';

ReactDOM.createRoot(document.getElementById('root') as Element).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

export default {
  title: 'PC Browser',
};
