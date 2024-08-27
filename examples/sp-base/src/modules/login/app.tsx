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
      <button onClick={() => navigate('/')} type="button">
        To Home
      </button>
    </div>
  );
}

export default Login;
