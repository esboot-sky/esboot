import { Button } from 'antd';
import { useNavigate, Outlet } from 'react-router-dom';

import A from './a';
import './app.scss';

function Test() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div styleName="text">module css1</div>
      <div
        className="mb-[20px] flex items-center justify-between bg-blue-500 bg-violet-500 p-4 text-[36px] font-semibold
          text-white hover:bg-violet-600 focus:outline-none focus:ring focus:ring-violet-300 active:bg-violet-700"
      >
        Hello, TailwindCSS!
      </div>
      <Button onClick={() => navigate('/test')}>To Test</Button>
      <div>module2 css323</div>
      <A />
      <Outlet />
    </div>
  );
}

export default Test;
