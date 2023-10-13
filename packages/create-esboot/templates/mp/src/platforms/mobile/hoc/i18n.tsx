import { IntlProvider } from 'react-intl';
import { useLanguage } from '@mobile/hooks/use-language';
import { I18nOption } from '@/types';

export default function wrapI18n(App: any, options: I18nOption): React.ReactNode {
  function I18nApp() {
    const language = useLanguage();

    return (
      <IntlProvider messages={options.messageDict[language]} locale={language}>
        {App}
      </IntlProvider>
    );
  }

  return <I18nApp />;
}
