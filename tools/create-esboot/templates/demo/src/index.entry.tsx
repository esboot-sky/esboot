import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import App from './app';
import '@/styles/index.scss';

ReactDOM.createRoot(document.getElementById('root') as Element).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

export default {
  title: 'ESBoot Demo',
};
