import { cn } from '@dz-web/esboot-browser';
import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { login } from '@/api';

import { langBtn } from './variant';
// import A from './a';
import './app.scss';
import './test.css';

const a = 1;
console.log(a);
function Test() {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [count3, setCount3] = useState(0);

  const getCount2 = (() => {
    console.log('exec count2');
    return count + 1;
  })();

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
        module css233
        {getCount2}
      </div>
      <div
        className="mb-[20px] flex items-center justify-between bg-blue-500 p-5 text-[36px] font-semibold text-white
          hover:bg-violet-600 focus:outline-none focus:ring focus:ring-violet-300 active:bg-violet-700"
      >
        Hello, TailwindCSS4!
      </div>
      <button onClick={() => navigate('/test')} type="button">
        To Test
      </button>

      <h3 className={cn('font-[500] text-[blue]')}>{1}</h3>
      <p>close</p>
      <div className={langBtn()}>module2 css323</div>

      <Button onClick={() => setCount(count + 1)}>123</Button>
      <Button onClick={() => setCount3(count3 + 1)}>count3</Button>

      <Outlet />
    </div>
  );
}

export default Test;
