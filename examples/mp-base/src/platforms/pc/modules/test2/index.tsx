import { CacheStore } from '@dz-web/cache';
import { RouterProvider } from 'react-router-dom';

import router from './router';
import './index.scss';

CacheStore.setItem('test', 'hello world');

export default function RouterApp() {
  return <RouterProvider router={router} fallbackElement={<div>*</div>} />;
}
