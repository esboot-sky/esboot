import { useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';

import { settingNavigationTitle } from '@/helpers/native/msg';

export function useSetI18nPageTitle(i18nKey: string, enable = true) {
  const { locale, formatMessage } = useIntl();

  const title = useMemo(() => {
    return formatMessage({ id: i18nKey });
  }, [locale]);

  useSetPageTitle(title, enable);
}

export function useSetPageTitle(title: string, enable = true) {
  useEffect(() => {
    if (!enable) {
      return;
    }

    settingNavigationTitle({
      title,
    });
  }, [title, enable]);
}
