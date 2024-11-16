import { cn } from '@dz-web/esboot-browser';
import { Button } from 'antd';
import { useNavigate, Outlet } from 'react-router-dom';

// import A from './a';
import './app.scss';

function Test() {
  const navigate = useNavigate();

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
      <div>module2 css323</div>

      <Button>123</Button>
      <Outlet />
    </div>
  );
}

export default Test;
