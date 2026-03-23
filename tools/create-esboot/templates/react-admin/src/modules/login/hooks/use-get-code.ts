import { useState } from 'react';

import { queryGetCode } from '../api/login';

function useGetCode() {
  const [codeUrl, setCodeUrl] = useState('');

  const queryCode = () => {
    queryGetCode({ sid: sessionStorage.getItem('codeSid') || '' })
      .then((res) => {
        setCodeUrl(`data:image/jpeg;base64,${res?.result?.image}`);
        sessionStorage.setItem('codeSid', res?.result?.sid);
      })
      .catch(() => {});
  };

  return {
    queryCode,
    codeUrl,
  };
}

export default useGetCode;
