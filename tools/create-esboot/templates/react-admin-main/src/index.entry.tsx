import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { bootstrapQiankun } from '@/helpers/qiankun';
import '@/styles/index.scss';

import wrapI18n from './hoc/i18n';
import router from './router';

const app = wrapI18n(<RouterProvider router={router} fallbackElement={<div>*</div>} />, true);

ReactDOM.createRoot(document.getElementById('root') as Element).render(<StrictMode>{app}</StrictMode>);

bootstrapQiankun();

export default {
  title: '点证管理中台',
};
