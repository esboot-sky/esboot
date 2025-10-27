import * as React from 'react';
import { useSearchParam } from 'react-use';

import { IPiProgress } from '@/api/quotation/query';
import { useQuotationState } from '@/modules/quote-subscription/model/store';
// import LocalCache from '@/constants/cache/cache.';

const { useEffect } = React;
// const id = LocalCache.getCache('registerId');
// registerId
export default function useProgress(): IPiProgress {
  const piProgress = useQuotationState((state) => state.piProgress);
  const fetchPiProgress = useQuotationState((state) => state.fetchPiProgress);
  const id = useSearchParam('registerId');

  useEffect(() => {
    fetchPiProgress();
  }, [id]);

  return piProgress;
}
