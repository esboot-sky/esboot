import { mountReactApp } from '@dz-web/esboot-browser-react';
import SSGDemoPage from '@pc/modules/ssg-demo';
import '@/styles/index.scss';
import '@pc/styles/index.scss';

const app = <SSGDemoPage />;

if (typeof document !== 'undefined' && document.getElementById('root')) {
  mountReactApp(app, {
    hydrate: true,
  });
}

export default {
  title: 'pc-browser-ssg-demo',
  template: 'disable-rem',
  langJsonPicker: ['global'],
  ssg: {
    enable: true,
    hydrate: true,
    render: () => app,
  },
};
