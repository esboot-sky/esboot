import { useCallback, useState } from 'react';

function Demo() {
  const [status, setStatus] = useState(false);

  const clickHandler = useCallback(() => {
    setStatus((prevStatus) => !prevStatus);
  }, []);

  return (
    <div>
      <button onClick={clickHandler} type="button">Toggle</button>
      <p>{status ? 'open' : 'close'}</p>
    </div>
  );
}

export default Demo;
