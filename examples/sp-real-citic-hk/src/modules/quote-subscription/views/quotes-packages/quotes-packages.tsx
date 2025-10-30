import * as React from 'react';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import PageHead from '@/components/page-head/page-head';
import { EVENT_KEY } from '@/constants/event-key';
import { back, onEvent } from '@/helpers/native/msg';
import { openPage } from '@/helpers/native/url';

// import { activeTradeState, openUrlMenu } from '@/helpers/native/msg';
// import { openPage } from '@/helpers/native/url';

import Header from './components/header';
import PackageItem from './components/package-item';
import './quotes-packages.scss';

const QuotesPackages: React.FC = () => {
  const { formatMessage } = useIntl();
  // openUrlMenu({ text: formatMessage({ id: 'p3' }), url: openPage('quotes-packages-order-history .html') });

  // 点击PackageItem里面的撤回订购 需要刷新Header数据字段
  const [isRefresh, setIsRefresh] = useState(false);

  useEffect(() => {
    // const cancel = onEvent(
    //   {
    //     event: EVENT_KEY.SUBSCRIBE_QUOTES_PACKAGE_SUCCESS,
    //     key: `${EVENT_KEY.SUBSCRIBE_QUOTES_PACKAGE_SUCCESS}-${window.location.href}`,
    //   },
    //   () => {
    //     setIsRefresh(true);
    //   },
    // );

    // return cancel;
  }, []);

  return (
    <div styleName="subscribe">
      <PageHead
        goback={() => {
          back();
        }}
        rightNode={
          <div
            className="text-[28px] text-[#BB874A]"
            onClick={() => {
              openPage('/quotes-packages-order-history.html');
            }}
          >
            {formatMessage({ id: 'order_history' })}
          </div>
        }
      >
        <span className="text-[36px] font-medium text-[#111214]">{formatMessage({ id: 'my_quote' })}</span>
      </PageHead>
      <div styleName="content">
        <Header refresh={isRefresh} />
        <PackageItem onRefresh={setIsRefresh} isRefresh={isRefresh} />
      </div>
    </div>
  );
};

export default QuotesPackages;
