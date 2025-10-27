import { cn } from '@dz-web/esboot-browser';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSearchParam } from 'react-use';

import PageHead from '@/components/page-head/page-head';
import { EVENT_KEY } from '@/constants/event-key';
import { back, emitEvent, PageType, settingNavigationTitle } from '@/helpers/native/msg';
import failure from '@/images/failure.svg?url';
import processing from '@/images/icon-processing.svg?url';
import succeed from '@/images/success.svg?url';

import './quotes-package-order-success.scss';

const content: Record<string, { title: string; content: string; img: string; reason?: string }> = {
  Processing: {
    title: 'market_opening_application_has_been_submitted',
    content: 'your_quotation_service_is_being_processed',
    img: processing,
  },
  failure: {
    title: 'sorry_your_quotation_service_failed',
    content: 'your_quotation_service_failed',
    reason: '',
    img: failure,
  },
  Success: {
    title: 'quotes-package-order-success.subscription_success',
    content: 'quotes-package-order-success.your_quotation_service_successfully',
    img: succeed,
  },
};

const QuotesPackageOrderSuccess: React.FC = () => {
  const { formatMessage } = useIntl();
  settingNavigationTitle({ title: formatMessage({ id: 'quotes-package-order-success.header' }) });
  // 获取url参数 TODO
  const status = useSearchParam('status') as keyof typeof content | undefined;
  const text = status && content[status] ? content[status] : content.Success;

  React.useEffect(() => {
    // 注册订阅
    emitEvent(EVENT_KEY.SUBSCRIBE_QUOTES_PACKAGE_SUCCESS, {});
  }, []);

  return (
    <div styleName="order-success">
      <PageHead
        goback={() => {
          back({ pageType: PageType.HTML, path: `${window.location.origin}/quotes-packages.html` });
        }}
      >
        <span className="text-[36px] font-medium text-[#111214]">
          {formatMessage({ id: 'quotes-package-order-success.header' })}
        </span>
      </PageHead>
      <div styleName="img-wap">
        <img styleName="img-ok" src={text.img} alt="" />
      </div>
      <div styleName="order-success-name">{formatMessage({ id: text.title })}</div>
      <div styleName="order-success-option">{formatMessage({ id: text.content })}</div>
      {text.reason && <div className={cn('text-center text-[26px] text-[#FF2C00]')}>{text.reason}</div>}
    </div>
  );
};

export default QuotesPackageOrderSuccess;
