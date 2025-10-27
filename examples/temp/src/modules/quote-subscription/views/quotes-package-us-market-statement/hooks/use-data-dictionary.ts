import { useQuery } from '@tanstack/react-query';

import { fetchDictList } from '@/api/quotation/query';

export enum ITypes {
  page_tips = 'page_tips_list',
}
const useDataDictionary = (types: string[]) => {
  return useQuery({
    queryKey: [ITypes.page_tips],
    queryFn: () => {
      return fetchDictList({ types }).then((res) => {
        console.log('res.result[ITypes.page_tips]', res.result);
        return res.result;
      });
    },
    gcTime: 10000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchIntervalInBackground: false,
    networkMode: 'always',
  });
};

export default useDataDictionary;
