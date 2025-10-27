import * as React from 'react';
import { useLocation } from 'react-router-dom';

import { getSearchParams } from '@/utils/url';

export function useGetParams(): Record<string, string> {
  const location = useLocation();

  const params = React.useMemo(() => getSearchParams() || {}, [location]);

  return params;
}
