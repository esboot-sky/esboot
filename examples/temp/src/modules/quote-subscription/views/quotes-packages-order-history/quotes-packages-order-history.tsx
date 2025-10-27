import { toFixed, toThousand } from '@dz-web/o-orange';
import * as React from 'react';
import { useIntl } from 'react-intl';

import { requestOrderQuoList, IOrderQuoList, IPayType } from '@/api/quotation/query';
import Empty from '@/components/empty/empty';
import { settingNavigationTitle } from '@/helpers/native/msg';
import useInitNative from '@/hooks/use-init-native';
import IconTag from '@/images/quote-subscription/icon_tag.svg?url';

import './quotes-packages-order-history.scss';

const { useEffect, useState, useMemo, useCallback } = React;

const QuotesPackagesOrderHistory: React.FC = () => {
  useInitNative();
  const { formatMessage } = useIntl();

  const [quoList, setQuoList] = useState<IOrderQuoList[]>([]);
  useEffect(() => {
    const getRequest = async () => {
      const data = await requestOrderQuoList();
      if (data?.code === 0) {
        setQuoList(data.result);
      }
    };
    getRequest();
  }, []);
  settingNavigationTitle({ title: formatMessage({ id: 'header' }) });

  const repetitionItem = useCallback(
    (item: IOrderQuoList) => {
      return [
        {
          name: formatMessage({ id: 'order_amount' }),
          argc: `${toThousand(toFixed(item?.amount))} ${item?.currency || '--'}`,
        },
        { name: formatMessage({ id: 'order_duration' }), argc: item.period },
        { name: formatMessage({ id: 'order_time' }), argc: item.createTime },
        { name: formatMessage({ id: 'expected_effective_time' }), argc: item.enableStartDate },
        { name: formatMessage({ id: 'expiration_time' }), argc: item.enableEndDate },
      ];
    },
    [quoList],
  );

  const getStatus = (status: string) => {
    // TODO 待优化 1 已过期 2 待生效 3 已生效
    if (status === formatMessage({ id: 'overdue' })) {
      return 'overdue';
    }
    if (status === formatMessage({ id: 'pending' })) {
      return 'pending';
    }
    if (status === formatMessage({ id: 'effect' })) {
      return 'effect';
    }
    //
    return 'overdue';
  };

  const setKey = (key: string, n: number) => `${key}-${n}`;
  const showOrderItem = useMemo(
    () =>
      quoList.map((item, i) => (
        <div styleName="item" key={setKey(item.enableEnd, i)}>
          <div styleName="item-header">
            {item.payType === IPayType.AUTO_RENEW_PAY ? (
              <div styleName="icon-tag">
                <img src={IconTag} alt="icon-tag" />
                <span styleName="icon-tag-text">{formatMessage({ id: 'auto_renew_deduction' })}</span>
              </div>
            ) : null}
            <div styleName="item-name">{item.name}</div>
            <div styleName={`${getStatus(item.status)}`}>{item.status}</div>
          </div>
          {repetitionItem(item).map((iten, index) => (
            <div styleName="item-block" key={setKey(item.name, index)}>
              <span>{iten.name}：</span>
              <span styleName="item-time">{iten.argc}</span>
            </div>
          ))}
        </div>
      )),
    [quoList],
  );

  return (
    <div styleName="order-wrap">
      {quoList.length ? showOrderItem : <Empty text={formatMessage({ id: 'no_record_yet' })} />}
    </div>
  );
};

export default QuotesPackagesOrderHistory;
