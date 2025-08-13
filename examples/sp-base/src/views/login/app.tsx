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
      <button onClick={clickHandler} type="button" className="mt-3 bg-red-500">
        Toggle
      </button>
      234233242332432234323432
      <p>{status ? 'open' : 'close'}</p>
      <button onClick={() => navigate('/')} type="button">
        To Home
      </button>
    </div>
  );
}

export default Login;
