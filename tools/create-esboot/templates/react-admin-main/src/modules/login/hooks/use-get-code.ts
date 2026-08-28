import { useCallback, useRef, useState } from 'react';

import { fetchGetCode } from '../api/login';

function useGetCode() {
  const [codeUrl, setCodeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const isFetchingRef = useRef(false);

  const queryCode = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);

    try {
      const res: any = await fetchGetCode({ sid: sessionStorage.getItem('codeSid') || '' });
      if (res?.result?.image) {
        setCodeUrl(`data:image/jpeg;base64,${res.result.image}`);
      }
      if (res?.result?.sid) {
        sessionStorage.setItem('codeSid', res.result.sid);
      }
    }
    catch (err) {
      console.error('[Login] fetchGetCode error:', err);
    }
    finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, []);

  return {
    queryCode,
    codeUrl,
    loading,
  };
}

export default useGetCode;

