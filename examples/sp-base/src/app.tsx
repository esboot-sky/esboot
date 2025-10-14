import { ErrorBoundary } from '@dz-web/esboot-browser-react';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <ErrorBoundary>
      <Outlet />
    </ErrorBoundary>
  );
}

export default App;
