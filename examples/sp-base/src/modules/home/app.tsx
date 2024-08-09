import { Button } from 'antd';
import { useNavigate, Outlet } from 'react-router-dom';

// import './app.scss';
import './app.module.scss';

function Test() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div styleName="text">module css</div>
      <div className="bg-blue-500 p-4 text-white">Hello, Tailwind!</div>
      <Button onClick={() => navigate('/test')}>To Test</Button>
      <Outlet />
    </div>
  );
}

export default Test;
