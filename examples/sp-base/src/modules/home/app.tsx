import { Button } from 'antd';
import { useNavigate, Outlet } from 'react-router-dom';

import A from './a';
import './app.scss';

function Test() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div styleName="text">module css1</div>
      <div className="bg-blue-500 p-4 text-white">Hello, TailwindCSS!</div>
      <Button onClick={() => navigate('/test')}>To Test</Button>
      <div styleName="text2">module2 css323</div>
      <A />
      <Outlet />
    </div>
  );
}

export default Test;
