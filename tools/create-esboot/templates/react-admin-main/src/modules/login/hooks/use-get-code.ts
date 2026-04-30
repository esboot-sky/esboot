import { useState } from 'react';

import { fetchGetCode } from '../api/login';

const useGetCode = () => {
  const [codeUrl, setCodeUrl] = useState('');

  const queryCode = () => {
    fetchGetCode({ sid: sessionStorage.getItem('codeSid') || '' })
      .then((res) => {
        setCodeUrl(`data:image/jpeg;base64,${res?.result?.image}`);
        sessionStorage.setItem('codeSid', res?.result?.sid);
      })
      .catch((err) => {
        console.log(err, '--> err');
      });
  };

  return {
    queryCode,
    codeUrl,
  };
};

export default useGetCode;
