import { Button } from 'antd';
import { useNavigate, Outlet } from 'react-router-dom';

import './app.scss';

function Test() {
  const navigate = useNavigate();

  return (
    <div className="page">
      Home2322311
      <Button onClick={() => navigate('/test')}>To Test</Button>
      <Outlet />
    </div>
  );
}

export default Test;
