import { Outlet } from 'react-router';

function App() {
  return (
    <div className="text-red-500">
      Welcome to ESBoot@4!
      <Outlet />
    </div>
  );
};

export default App;
