import { Button } from 'antd';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const [status, setStatus] = useState(false);

  const clickHandler = useCallback(() => {
    setStatus((prevStatus) => !prevStatus);
  }, []);

  return (
    <div>
      <button onClick={clickHandler} type="button">
        Toggle
      </button>
      登录
      <p>{status ? 'open' : 'close'}</p>
      <Button onClick={() => navigate('/')}>To Home</Button>
    </div>
  );
}

export default Login;
