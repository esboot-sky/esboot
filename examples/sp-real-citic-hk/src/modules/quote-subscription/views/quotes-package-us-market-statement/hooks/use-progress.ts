import { useEffect, useState } from 'react';

import { requestProgress } from '@/api/quotation/market-statement';

const useProgress = () => {
  const [progress, setProgress] = useState('');
  const getProgress = async () => {
    try {
      const { result } = await requestProgress();
      console.log('requestProgress', result);
      const { authProgress } = result;
      setProgress(authProgress);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getProgress();
  }, []);
  return {
    progress,
  };
};
export default useProgress;
