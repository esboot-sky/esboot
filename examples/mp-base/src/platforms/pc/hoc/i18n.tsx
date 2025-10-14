import type { Language } from '@/constants/config';
import type { i18nMessageDict } from '@/types';

import { useLanguage } from '@pc/hooks/use-language';
import { useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { getPageI18n } from '@/helpers/import-locales';

export default function wrapI18n(App: any, i18n = true): React.ReactNode {
  if (!i18n)
    return App;

  function I18nApp() {
    const [messageDict, setMessageDict] = useState<i18nMessageDict | null>(null);
    const [loading, setLoading] = useState(true);
    const language = useLanguage() as Language;

    useEffect(() => {
      setLoading(true);

      getPageI18n(language)
        .then((dict) => {
          setMessageDict({ ...dict, [language]: dict[language] });
          setLoading(false);
        })
        .catch((error) => {
          console.error('Failed to load i18n messages:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }, [language]);

    if (loading || !messageDict) {
      return <div>Loading translations...</div>;
    }

    console.log('messageDict', messageDict, language);

    return (
      <IntlProvider messages={messageDict[language] || {}} locale={language}>
        {App}
      </IntlProvider>
    );
  }

  return <I18nApp />;
}
