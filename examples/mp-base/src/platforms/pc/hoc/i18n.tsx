import { IntlProvider } from 'react-intl';

import { getPageI18n } from '@/helpers/import-locales';
import { i18nMessageDict } from '@/types';
import { useLanguage } from '@pc/hooks/use-language';

export default function wrapI18n(App: any, i18n = true): React.ReactNode {
  if (!i18n) return App;
  const messageDict: i18nMessageDict = getPageI18n();

  function I18nApp() {
    const language = useLanguage();

    return (
      <IntlProvider messages={messageDict[language]} locale={language}>
        {App}
      </IntlProvider>
    );
  }

  return <I18nApp />;
}
