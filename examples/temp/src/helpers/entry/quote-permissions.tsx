import { useUserQuotePermissions } from '@/hooks/quote/use-user-quote-permissions';

import { getDisplayName } from './native';

export default function wrapQuotePermissions(App: any) {
  const InternalApp = () => {
    useUserQuotePermissions();

    return App;
  };

  InternalApp.displayName = `wrapQuotePermissions(${getDisplayName(App)})`;
  return <InternalApp />;
}
