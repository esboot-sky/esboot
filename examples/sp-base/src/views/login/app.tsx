import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const [status, setStatus] = useState(false);

  const clickHandler = useCallback(() => {
    setStatus(prevStatus => !prevStatus);
  }, []);

  return (
    <div>
      <button onClick={clickHandler} type="button" className="pt-5 bg-red-500 mt-3 bg-red-500 bg-red-500 w-[5px]">
        Toggle sadfaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
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

