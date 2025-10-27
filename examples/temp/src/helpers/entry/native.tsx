import { QuoteClientProvider } from '@dz-web/quote-client-react';
import { useEffect, useState } from 'react';

import { fetchGatewayList } from '@/api/quotation/query';
import { CacheStore, CacheKey } from '@/constants/cache';
import { isEntryPage } from '@/helpers/url';
import useInitNative from '@/hooks/use-init-native';
import { useAppStore } from '@/model/app';

export function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

const cacheQuoteSocketUrl = CacheStore.getItem(CacheKey.quoteSocketUrl, '');
export default function wrapNative(App: any, needQuote: boolean): any {
  const InternalApp = () => {
    useInitNative();

    const [quoteSocketUrl, setQuoteSocketUrl] = useState(cacheQuoteSocketUrl);
    const { token } = useAppStore.getState();

    useEffect(() => {
      if (!needQuote) return;
      if (!isEntryPage() && cacheQuoteSocketUrl) return;

      fetchGatewayList()
        .then((res) => {
          const { result } = res;

          try {
            const { url } = result[0];
            const _url = `wss:${url}/socket`;
            setQuoteSocketUrl(`wss:${url}/socket`);
            CacheStore.setItem(CacheKey.quoteSocketUrl, _url);
          } catch (error) {
            setQuoteSocketUrl('');
            console.log(error, 'error');
          }
        })
        .catch((err) => {
          setQuoteSocketUrl('');
          console.log(err, 'err');
        });
    }, [needQuote]);

    if (!needQuote) return App;
    return (
      <QuoteClientProvider token={token} url={quoteSocketUrl}>
        {App}
      </QuoteClientProvider>
    );
  };

  InternalApp.displayName = `wrapNative(${getDisplayName(App)})`;
  return <InternalApp />;
}
