import loadable from '@loadable/component';

const App = loadable(() => import('./app'));
const Test = loadable(() => import('../test/app'));

export default [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/test',
        element: <Test />,
      },
    ],
  },
];
