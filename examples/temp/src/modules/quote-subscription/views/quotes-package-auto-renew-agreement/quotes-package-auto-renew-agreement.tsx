import { useIntl } from 'react-intl';

import { useSetI18nPageTitle } from '@/hooks/use-set-i18n-page-title';
import { getSearchParams } from '@/utils/url';

function QuotesPackageAutoRenewAgreement() {
  const { formatMessage } = useIntl();
  const hashParams = getSearchParams();
  const { title } = hashParams;

  useSetI18nPageTitle(formatMessage({ id: `quotes-package-auto-renew-agreement.${title}` }));
  return (
    <div className="p-1 text-[28px] leading-[2.5] text-[#111214]">
      <p>{formatMessage({ id: 'quotes-package-auto-renew-agreement.p1' })}</p>
      <p>{formatMessage({ id: 'quotes-package-auto-renew-agreement.p2' })}</p>
      <p>{formatMessage({ id: 'quotes-package-auto-renew-agreement.p3' })}</p>
      <p>{formatMessage({ id: 'quotes-package-auto-renew-agreement.p4' })}</p>
      <p>{formatMessage({ id: 'quotes-package-auto-renew-agreement.p5' })}</p>
      <p>{formatMessage({ id: 'quotes-package-auto-renew-agreement.p6' })}</p>
      <p>{formatMessage({ id: 'quotes-package-auto-renew-agreement.p7' })}</p>
      <p>{formatMessage({ id: 'quotes-package-auto-renew-agreement.p8' })}</p>
      <p>{formatMessage({ id: 'quotes-package-auto-renew-agreement.p9' })}</p>
      <p>{formatMessage({ id: 'quotes-package-auto-renew-agreement.p10' })}</p>
      <p>{formatMessage({ id: 'quotes-package-auto-renew-agreement.p11' })}</p>
      <p>{formatMessage({ id: 'quotes-package-auto-renew-agreement.p12' })}</p>
      {/* 首行缩进 */}
      <p className="pl-[12px]">{formatMessage({ id: 'quotes-package-auto-renew-agreement.p12_1' })}</p>
      <p className="pl-[12px]">{formatMessage({ id: 'quotes-package-auto-renew-agreement.p12_2' })}</p>
      <p className="pl-[12px]">{formatMessage({ id: 'quotes-package-auto-renew-agreement.p12_3' })}</p>
      <p className="pl-[12px]">{formatMessage({ id: 'quotes-package-auto-renew-agreement.p12_4' })}</p>
      <p className="pl-[12px]">{formatMessage({ id: 'quotes-package-auto-renew-agreement.p12_5' })}</p>
      <p className="pl-[12px]">{formatMessage({ id: 'quotes-package-auto-renew-agreement.p12_6' })}</p>
      <p>{formatMessage({ id: 'quotes-package-auto-renew-agreement.p13' })}</p>
    </div>
  );
}

export default QuotesPackageAutoRenewAgreement;
