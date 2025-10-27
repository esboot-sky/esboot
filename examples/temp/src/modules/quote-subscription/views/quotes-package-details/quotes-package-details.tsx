/* eslint-disable import/no-unresolved */
/* eslint-disable import/order */
/* eslint-disable operator-linebreak */
import * as React from 'react';
import { useIntl } from 'react-intl';

import { toFixed } from '@dz-web/o-orange';
import { settingNavigationTitle } from '@/helpers/native/msg';
import { openPage } from '@/helpers/native/url';
import useConstData from '@/modules/quote-subscription/hooks/use-const-data';

import useDetail from '@/modules/quote-subscription/hooks/use-detail';
import './quotes-package-details.scss';

import buying from '@/modules/quote-subscription/images/white/package_buying.svg?url';
import dishprice from '@/modules/quote-subscription/images/white/package_dishprice.svg?url';

import banner from '@/modules/quote-subscription/images/white/package_banner.png';

import point from '@/modules/quote-subscription/images/white/package_point.svg?url';
import realTime from '@/modules/quote-subscription/images/white/package_real_time.svg?url';
import { cn } from '@dz-web/esboot-browser';
import { QuoteLevelPermissionCode } from '@/model/quote-permissions';
import { marketType } from '@/constants/quotation';

const { useMemo } = React;

// 定义功能组合配置
const featureConfigs = {
  // 港股L1和美股L1：实时推送、一档盘口、分笔成交（去掉"买卖经纪"）
  hkUsLevel1: ['realTimePush', 'tenLevelMarket', 'transactionByTranches'],
  // 默认配置：包含所有功能
  default: ['realTimePush', 'tenLevelMarket', 'tradingBroker', 'transactionByTranches'],
};

const PackageDetails: React.FC = () => {
  const packageDetails = useDetail();
  // const id = useSearchParam('registerId');
  const { formatMessage } = useIntl();

  const { count, terminal } = useConstData(packageDetails);

  const {
    product: { type, code },
    period,
    price,
  } = packageDetails;

  settingNavigationTitle({ title: formatMessage({ id: 'header' }) });

  const topItemAry = useMemo(() => {
    // 定义所有可能的功能项
    const featureItems = {
      realTimePush: {
        name: formatMessage({ id: 'real_time_push' }),
        img: realTime,
      },
      tenLevelMarket: {
        name: formatMessage({ id: 'one_level_market' }),
        img: dishprice,
      },
      tradingBroker: {
        name: formatMessage({ id: 'trading_broker' }),
        img: buying,
      },
      transactionByTranches: {
        name: formatMessage({ id: 'transaction_by_tranches' }),
        img: point,
      },
    };
    // 判断使用哪个配置
    const isHkUsLevel1 =
      (type === Number(marketType.HK) || type === Number(marketType.US)) && QuoteLevelPermissionCode.LEVEL_1 === code;
    // 对于行情产品为港股L2，对应的功能为：实时推送、十档盘口、买卖经纪、分笔成交
    if (QuoteLevelPermissionCode.LEVEL_2 === code && type === Number(marketType.HK)) {
      featureItems.tenLevelMarket.name = formatMessage({ id: 'ten_level_market' });
      featureItems.tradingBroker.name = formatMessage({ id: 'trading_broker' });
    }

    //  对于行情产品为港股L2，对应的功能为：实时推送、十档盘口、买卖经纪、分笔成交。即左图原型所示。
    const configKey = isHkUsLevel1 ? 'hkUsLevel1' : 'default';

    const selectedFeatures = featureConfigs[configKey];
    return selectedFeatures.map((featureKey) => featureItems[featureKey as keyof typeof featureItems]);
  }, [type, code, formatMessage]);

  const isPIText = () => {
    if (packageDetails?.isPi === null) {
      return formatMessage({ id: 'all_customer' });
    }
    return packageDetails?.isPi
      ? formatMessage({ id: 'professional_customer' })
      : formatMessage({ id: 'non_professional_customer' });
  };

  return (
    <div styleName="package-details">
      <div styleName="top">
        <img styleName="top-img" src={packageDetails?.img || banner} alt="" />
        <div styleName="top-info">
          {/* 显示两行，超出省略号 */}
          <p className={cn('w-[300px] text-[38px] font-semibold text-[#111214]', 'line-clamp-2')}>
            {packageDetails?.name}
          </p>
          {/* <p className={cn('text-[28px] text-[#111214]')}>大陆版</p> */}
          <p className={cn('text-[38px mt-[10px] font-normal text-[#A15700]')}>
            {packageDetails?.currency}
            <span className={cn('text-[46px] font-semibold')}>
              {toFixed(packageDetails.specialPrice !== null ? packageDetails.specialPrice : price, { precision: 2 })}
            </span>
            /{count[period]}
            {packageDetails.specialPrice !== null ? (
              <span className={cn('ml-[18px] text-[26px] font-normal text-[#A15700] line-through')}>
                {packageDetails?.currency} {toFixed(price, { precision: 2 })}/{count[period]}
              </span>
            ) : null}
          </p>
        </div>
        <div styleName="top-wrap">
          {!!topItemAry.length &&
            topItemAry.map((item) => (
              <div styleName="top-item" key={item.name}>
                <img styleName="top-item-img" src={item.img} alt="" />
                <span styleName="top-item-name">{item.name}</span>
              </div>
            ))}
        </div>
      </div>
      <div styleName="middle">
        {/* 对于行情产品为美股L1  需要隐藏上面的， 只是展示下面 */}
        {type === Number(marketType.US) && code === QuoteLevelPermissionCode.LEVEL_1 ? (
          <div styleName="middle-item">
            <span className="w-[150px]">{formatMessage({ id: 'applicable_customer_group' })}</span>
            <span styleName="middle-item-name">{isPIText()}</span>
          </div>
        ) : (
          <>
            <div styleName="middle-item">
              <span className="w-[150px]">{formatMessage({ id: 'applicable_regions' })}</span>
              <span styleName="middle-item-name">{packageDetails?.availableArea}</span>
            </div>
            <div styleName="middle-item">
              <span className="w-[150px]">{formatMessage({ id: 'applicable_terminal' })}</span>
              <div styleName="middle-item-name">
                {packageDetails?.terminal.map((item) => (
                  <span styleName="terminal" key={item}>
                    {terminal[item]}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      <div styleName="option">
        <p>{formatMessage({ id: 'only_for_global_use_warm_reminder' })}</p>
        <p>{formatMessage({ id: 'p1' })}</p>
        <p>{formatMessage({ id: 'p2' })}</p>
        <p>{formatMessage({ id: 'p3' })}</p>
      </div>
      <div styleName="tail">
        <div styleName="tail-click">
          <div
            styleName="buy-click"
            onClick={() => {
              openPage(`/quotes-package-submit-order.html?registerId=${packageDetails.id}`);
            }}
          >
            {formatMessage({ id: 'buy_now' })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default PackageDetails;
