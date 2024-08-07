import { ConfigProvider } from 'antd';
import { Outlet } from 'react-router-dom';

const App = () => (
  <ConfigProvider>
    <Outlet />
  </ConfigProvider>
);

export default App;


