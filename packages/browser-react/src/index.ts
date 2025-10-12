import { useState } from 'react';

export function useTest(): {
  count: number;
  setCount: (count: number) => void;
} {
  const [count, setCount] = useState(0);

  // useEffect(() => {
  //   setCount(count + 1);
  //   console.log('count', count);
  // }, [count]);

  return {
    count,
    setCount,
  };
}

export * from './error-boundary/error-boundary';
export { useErrorBoundary, withErrorBoundary } from 'react-error-boundary';
