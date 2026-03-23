import { Suspense } from 'react';
import { RouterProvider } from 'react-router';

import './index.scss';
import router from './router';

export default function RouterApp() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
