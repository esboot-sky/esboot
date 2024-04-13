import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';

export function mounteReact(innerApp: React.ReactElement) {
  createRoot(document.getElementById('root') as Element)
    .render(
      <StrictMode>{innerApp}</StrictMode>,
    );
}
