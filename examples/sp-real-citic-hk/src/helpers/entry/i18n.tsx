import { useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';

import { getPageI18n, type i18nMessageDict } from '@/helpers/import-locales';
import { useAppStore } from '@/model/app';

/**
 * @deprecated
 */
interface I18nLegacyProps {
  messageDict: i18nMessageDict;
}

export type I18nProps = boolean | I18nLegacyProps;

export default function wrapI18n(App: React.ReactNode, i18n: I18nProps = true): React.ReactNode {
  if (!i18n) return App;

  function I18nApp() {
    const [messageDict, setMessageDict] = useState<i18nMessageDict | null>(null);
    const [loading, setLoading] = useState(true);
    const language = useAppStore((state) => state.language);
    const lan = language?.replace(/_/g, '-') as keyof i18nMessageDict; // 解决国际化不支持 下划线形式

    useEffect(() => {
      if (typeof i18n === 'object' && 'messageDict' in i18n) {
        setMessageDict(i18n.messageDict);
        setLoading(false);
        return;
      }

      setLoading(true);

      getPageI18n(lan)
        .then((dict) => {
          setMessageDict({ ...dict, [lan]: dict[lan] });
        })
        .catch((error) => {
          console.error('Failed to load i18n messages:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }, [lan, i18n]);

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
