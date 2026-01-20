import { Suspense } from 'react';
import { RouterProvider } from 'react-router';

import router from './router';
import './index.scss';

export default function RouterApp() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
