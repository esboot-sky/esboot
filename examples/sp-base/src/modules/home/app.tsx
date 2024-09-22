import { cn } from '@dz-web/esboot-browser';
import { useNavigate, Outlet } from 'react-router-dom';

import A from './a';
import './app.scss';

function Test() {
  const navigate = useNavigate();

  console.log(cn);

  // const b = abcs;

  // console.log(b);

  return (
    <div className="page">
      <div styleName="text">module css1</div>
      <div
        className="mb-[20px] flex items-center justify-between bg-blue-500 bg-violet-500 p-4 text-[36px] font-semibold
          text-white hover:bg-violet-600 focus:outline-none focus:ring focus:ring-violet-300 active:bg-violet-700"
      >
        Hello, TailwindCSS!
      </div>
      <button onClick={() => navigate('/test')} type="button">
        To Test122333456456
      </button>

      <h3 className={cn('font-[500] text-[blue]')}>{1}</h3>
      <div>module2 css323</div>
      <A />
      <Outlet />
    </div>
  );
}

export default Test;
