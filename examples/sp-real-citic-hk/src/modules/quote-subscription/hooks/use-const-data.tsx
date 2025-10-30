import * as React from 'react';
import { useIntl } from 'react-intl';

const { useMemo } = React;

const useConstData = (isChange: any) => {
  const { formatMessage } = useIntl();

  const count = useMemo(
    () => ({
      1: '天',
      2: '个月',
      3: formatMessage({ id: 'week' }),
    }),
    [isChange],
  );

  const terminal = useMemo(
    () => ({
      0: formatMessage({ id: 'all_devices' }),
      1: formatMessage({ id: 'mobile_terminal' }),
      2: 'PC端',
    }),
    [isChange],
  );

  // 群体， 仅限非专业客户使用 和 仅限专业客户使用
  const customerGroup = useMemo(
    () => ({
      0: formatMessage({ id: 'non_professional_customer' }),
      1: formatMessage({ id: 'professional_customer' }),
    }),
    [isChange],
  );

  return { count, terminal, customerGroup };
};
export default useConstData;
