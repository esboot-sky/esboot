import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

export function mounteReact(innerApp: React.ReactElement, disableStrictMode = false) {
  const RootApp = disableStrictMode ? innerApp : <StrictMode>{innerApp}</StrictMode>;

  createRoot(document.getElementById('root') as Element).render(RootApp);
}
