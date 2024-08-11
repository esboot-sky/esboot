import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import './styles/index.module.scss';

import router from './router';

ReactDOM.createRoot(document.getElementById('root') as Element).render(
  <StrictMode>
    <RouterProvider router={router} fallbackElement={<div>*</div>} />
  </StrictMode>,
);

export default {
  title: 'PC Browser',
};
