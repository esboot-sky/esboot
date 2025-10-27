import * as React from 'react';
import { useSearchParam } from 'react-use';

import { IPackageDetail } from '@/api/quotation/query';
import { useQuotationState } from '@/modules/quote-subscription/model/store';
// import LocalCache from '@/constants/cache/cache.';

const { useEffect } = React;
// const id = LocalCache.getCache('registerId');
// registerId
export default function useDetail(): IPackageDetail {
  const packageDetails = useQuotationState((state) => state.detail);
  const fetchPackageDetail = useQuotationState((state) => state.fetchPackageDetail);
  const id = useSearchParam('registerId');

  useEffect(() => {
    if (id) {
      fetchPackageDetail(id as string);
    }
  }, [id, fetchPackageDetail]);

  return packageDetails;
}
