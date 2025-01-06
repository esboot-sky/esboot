import { cn } from '@dz-web/esboot-browser';
import { Button } from 'antd';
import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

import { langBtn } from './variant';

// import { login } from '@/api';

// import A from './a';
import './app.scss';

function Test() {
  const navigate = useNavigate();

  useEffect(() => {
    // login({
    //   username: 'admin',
    //   password: '123456',
    // }).then((res) => {
    //   console.log(res);
    // });
  }, []);

  return (
    <div className="page">
      <div styleName="text text2" className="page">
        module css12343242
      </div>
      <div
        className="mb-[20px] flex items-center justify-between bg-blue-500 p-4 text-[36px] font-semibold text-white
          hover:bg-violet-600 focus:outline-none focus:ring focus:ring-violet-300 active:bg-violet-700"
      >
        Hello, TailwindCSS!
      </div>
      <button onClick={() => navigate('/test')} type="button">
        To Test122333456456
      </button>

      <h3 className={cn('font-[500] text-[blue]')}>{1}</h3>
      <p>close</p>
      <div className={langBtn()}>module2 css323</div>

      <Button>123</Button>

      <Outlet />
    </div>
  );
}

export default Test;
