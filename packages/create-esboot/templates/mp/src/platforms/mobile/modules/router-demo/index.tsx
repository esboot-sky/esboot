import { RouterProvider } from 'react-router-dom';
import { CacheStore } from '@dz-web/cache';
import './index.scss';
import router from './router';

CacheStore.setItem('test', 'hello world');

export default function RouterApp() {
  return (
    <RouterProvider
      router={router}
      fallbackElement={<div>*</div>}
    />
  );
}
