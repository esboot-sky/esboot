import type { i18nMessageDict } from '../helpers/import-locales';
import { useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { DEFAULT_LANGUAGE } from '@/constants/config';
import { useStore } from '@/helpers/multi-platforms';
import { getPageI18n } from '../helpers/import-locales';

export type I18nProps = boolean;

export default function wrapI18n(App: React.ReactNode, i18n: I18nProps = true): React.ReactNode {
  if (!i18n)
    return App;

  function I18nApp() {
    const [messageDict, setMessageDict] = useState<i18nMessageDict | null>(null);
    const [loading, setLoading] = useState(true);
    const language = useStore(state => state.userConfig.language);
    const lan = (language?.replace(/_/g, '-') || DEFAULT_LANGUAGE) as keyof i18nMessageDict;

    useEffect(() => {
      let cancelled = false;

      const loadLanguage = async () => {
        try {
          const dict = await getPageI18n(lan);
          if (!cancelled) {
            setMessageDict({ ...dict, [lan]: dict[lan] });
            setLoading(false);
          }
        }
        catch (error) {
          if (!cancelled) {
            console.error('Failed to load i18n messages:', error);
            setMessageDict(null);
            setLoading(false);
          }
        }
      };

      loadLanguage();

      return () => {
        cancelled = true;
      };
    }, [lan]);

    if (loading) {
      return null;
    }

    return (
      <IntlProvider messages={messageDict?.[lan] || {}} locale={lan}>
        {App}
      </IntlProvider>
    );
  }

  return <I18nApp />;
}
