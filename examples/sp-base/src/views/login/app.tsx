import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const c = 'bg-red-500 mt-3 bg-red-500 bg-red-500 w-[5px] bg-red-500 bg-red-500 424234234234234 23423423423 234234234 234234234 234234';
function Login() {
  const navigate = useNavigate();

  const [status, setStatus] = useState(false);

  const clickHandler = useCallback(() => {
    setStatus(prevStatus => !prevStatus);
  }, []);

  return (
    <div>
      <button onClick={clickHandler} type="button" className="pt-5 bg-red-500 mt-3 bg-red-500 bg-red-500 w-[5px] bg-red-500 bg-red-500">
        Toggle sadfaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadfasfasdfsd
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

