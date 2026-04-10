import { cn } from '@dz-web/esboot-browser';
import { useErrorBoundary } from '@dz-web/esboot-browser-react';
import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { login } from '@/api';

import styles from './app.scss';
// import A from './a';

import { langBtn } from './variant';

import './test.css';

console.log(styles, 'styles');

const a = 1;
console.log(a);
function Test() {
  const { showBoundary } = useErrorBoundary();
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [count3, setCount3] = useState(0);

  const getCount2 = (() => {
    console.log('exec count2');
    return count + 1;
  })();

  useEffect(() => {
    const cc = count + count3;

    // debugger
    // login({
    //   username: 'admin',
    //   password: '123456',
    // }).then((res) => {
    //   console.log(res);
    // });
  }, []);

  console.log('process.env.isMobile, ', process.env.isMobile);

  return (
    <div className="page">
      <div styleName="text2-cls">
        module css233
        {getCount2}
      </div>
      <div
        className={`
          bg-blue-500 p-5 font-semibold text-white mb-[20px] flex items-center justify-between
          text-[36px]
          hover:bg-violet-600
          focus:ring-violet-300 focus:ring focus:outline-none
          active:bg-violet-700
        `}
      >
        Hello, TailwindCSS!
      </div>
      <button onClick={() => navigate('/test')} type="button">
        To Test
      </button>

      <h3 className={cn('font-[500] text-[blue]')}>{1}</h3>
      <p>close</p>
      <div className={langBtn()}>module2 css323</div>

      <Button onClick={() => setCount(count + 1)}>123</Button>
      <Button onClick={() => setCount3(count3 + 1)}>count3</Button>

      <Button onClick={() => {
        showBoundary(new Error('test'));
      }}
      >
        throw error
      </Button>

      <Outlet />
    </div>
  );
}

export default Test;
