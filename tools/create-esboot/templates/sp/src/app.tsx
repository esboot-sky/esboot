import { Outlet } from 'react-router';

const App = () => (
  <div className="text-red-500">
    Welcome to ESBoot!
    <Outlet />
  </div>
);

export default App;
