import { cn } from '@dz-web/esboot-browser';
import { toFixed, toSlice, toThousand } from '@dz-web/o-orange';
import { Radio, Switch, Toast } from 'antd-mobile';
import Big from 'big.js';
import dayjs from 'dayjs';
import * as React from 'react';
import { useIntl } from 'react-intl';

import {
  IOrderVerify,
  IUserDetail,
  requestAccountDetail,
  requestFundDetail,
  requestOrderVerify,
  requestSave,
} from '@/api/quotation/query';
import Modal from '@/components/modal/modal';
import { settingNavigationTitle } from '@/helpers/native/msg';
import { openPage } from '@/helpers/native/url';
import useInitNative from '@/hooks/use-init-native';
import IconCheck from '@/images/check.svg?url';
import useDetail from '@/modules/quote-subscription/hooks/use-detail';
import downWhite from '@/modules/quote-subscription/images/arrow.png';

import useConstData from '../../hooks/use-const-data';
import { replaceSymbol } from '../../utils/num';

import MyInput from './components/my-input';
import PopupTime from './components/popup-time';
import './quotes-package-submit-order.scss';

const { useState, useEffect, useMemo, useCallback } = React;
const QuotesPackageSubmitOrder: React.FC = () => {
  const { formatMessage } = useIntl();
  useInitNative();

  // 显示套餐名称 金额
  const packageDetails = useDetail();

  // 2个选项框
  const [isConsent, setIsConsent] = useState(false);
  const [isAutoRenew, setIsAutoRenew] = useState(true);
  // 显示套餐数量
  const [current, setCurrent] = useState(1);
  const [isBuy, setIsBuy] = useState(true);
  const [isAutoRenewal, setIsAutoRenewal] = useState<boolean>(false);
  const [isConfirmOrder, setIsConfirmOrder] = useState<boolean>(false);
  const [isAutoRenewalAgreement, setIsAutoRenewalAgreement] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  // 期望生效点击时间的hook
  // const [visible, { toggle, setFalse }] = useBoolean(false);
  const [visible, setVisible] = React.useState(false);
  const isRequest = React.useRef(true);
  const datePickerChange = (date: Date) => {
    // 这个getDate 改成dayjs
    const enableStart = dayjs(date).format('YYYY/MM/DD');
    setVerify({ ...verify, enableStart });
  };

  const [infoDetail, setInDetail] = useState<IUserDetail>({
    accountType: '',
    balances: [],
    account: '',
  });

  // 初始化，请求头像和套餐2个接口
  useEffect(() => {
    // requsetUserDetail().then((res) => {
    //   if (res?.code === 0) {
    //     setInDetail(res.result);
    //   }
    // });
    requestFundDetail().then((res) => {
      if (res?.code === 0) {
        setInDetail((val) => ({ ...val, balances: res.result }));
      }
    });

    requestAccountDetail().then((res) => {
      if (res?.code === 0) {
        const { accountType, account } = res.result;
        setInDetail((val) => ({ ...val, accountType, account }));
      }
    });
  }, []);

  // 得到总金额和到期时间
  const [verify, setVerify] = useState<IOrderVerify>({
    amount: 0,
    enableEnd: '',
    enableStart: '',
    disableStart: false,
  });
  useEffect(() => {
    if (!packageDetails?.id || visible) return;

    const enableStart = replaceSymbol(verify.enableStart, /['/']/g, '-');
    requestOrderVerify({ enableStart, num: current, packageId: packageDetails.id })
      .then((res) => {
        if (res?.code === 0) {
          // res.result.enableEnd = replaceSymbol(res.result.enableEnd);
          // res.result.enableStart = replaceSymbol(res.result.enableStart);
          setVerify(res.result);
          setIsBuy(true);
          return;
        }
        setIsBuy(false);
      })
      .catch((err) => {
        setIsBuy(false);
      });
  }, [current, packageDetails, visible]);
  // 得到可用余额
  const balance = useMemo(() => {
    if (!infoDetail.balances.length) return 0;
    const currentBalances = infoDetail.balances.find((item) => item.currency === packageDetails?.currency);
    return currentBalances?.withdrawableBalance || 0;
  }, [infoDetail]);

  // 点击购买
  const buyClick = () => {
    if (!isConsent) {
      setIsAutoRenewalAgreement(true);
      // Toast.show({
      //   content: formatMessage({ id: 'p4' }),
      // });
      return;
    }

    setIsConfirmOrder(true);
  };

  const { count } = useConstData(packageDetails);
  const unit = useMemo(() => count[packageDetails.count], [packageDetails]);

  settingNavigationTitle({ title: formatMessage({ id: 'header' }) });

  const handleSubmit = useCallback(() => {
    if (!isRequest.current) return;
    isRequest.current = false;

    setIsConfirmOrder(false);
    setIsLoading(true);
    const autoRenew = isAutoRenew;
    const num = current;
    const packageId = packageDetails.id;
    const enableStart = replaceSymbol(verify.enableStart, /['/']/g, '-');
    requestSave({ autoRenew, enableStart, num, packageId })
      .then((res) => {
        if (res?.code === 0) {
          // registerUpdateQuotePermissionCallback(() => {});
          openPage('/quotes-package-order-success.html', { fullScreen: true });
        } else {
          isRequest.current = true;
          Toast.show({ content: res.message });
        }
      })
      .catch((err) => {
        console.log('err', err);
        isRequest.current = true;
        Toast.show({ content: err.message || err.msg });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isConsent, verify, isAutoRenew]);

  const handleSwitchChange = useCallback((val: boolean) => {
    setIsAutoRenew(val);

    if (!val) {
      setTimeout(() => {
        setIsAutoRenewal(true);
      }, 100);
    }
  }, []);

  const checkIcon = (checked: boolean) =>
    checked ? <img styleName="radio-check-img" src={IconCheck} alt="" /> : <div styleName="no-check-circle" />;
  return (
    <div styleName="submit">
      <div styleName="submit-content-box">
        {/* 套餐名字 */}
        <div styleName="package-wrap">
          <div styleName="package-title">
            <div className={cn('w-[300px] text-[32px] text-[#111214]', 'line-clamp-2')}>{packageDetails.name}</div>
            <div className={cn('text-[#BB874A]')}>
              {`${packageDetails.currency}
              ${toFixed(packageDetails.specialPrice || packageDetails.price, { precision: 2 })}`}
              <span>/</span>
              <span>{unit}</span>
            </div>
          </div>
          <div
            styleName="package-price"
            className={cn(
              packageDetails.specialPrice !== null ? 'block text-end text-[#BBAEA0] line-through' : 'hidden',
            )}
          >
            {`${packageDetails.currency} ${toFixed(packageDetails.price, { precision: 2 })}`}
            <span>/</span>
            <span>{unit}</span>
          </div>
        </div>
        {/* 套餐数量 */}
        <h2 styleName="title">{formatMessage({ id: 'order_info' })}</h2>
        <div styleName="order-info">
          <div styleName="market">
            <div styleName="market-block">
              <span>{formatMessage({ id: 'order_quantity' })}</span>
              <MyInput current={current} setCurrent={setCurrent} />
            </div>
          </div>
          {/* 套餐的生效时间 */}
          <div styleName="expire">
            <span>{formatMessage({ id: 'expected_effective_time' })}</span>
            <PopupTime
              onChange={(val) => {
                datePickerChange(val);
              }}
              visible={visible}
              setVisible={setVisible}
            >
              {verify.disableStart ? (
                <div styleName="expire-right">{verify.enableStart}</div>
              ) : (
                <div styleName="info-click" onClick={() => setVisible(true)}>
                  <span>{verify.enableStart}</span>
                  <img src={downWhite} alt="" styleName="icon" />
                </div>
              )}
            </PopupTime>
          </div>
          {/* 套餐的到期时间 */}
          {packageDetails.type === 1 ? (
            <div styleName="expire">
              <span>{formatMessage({ id: 'expiration_time' })}</span>
              <span styleName="expire-right">{verify?.enableEnd}</span>
            </div>
          ) : (
            ''
          )}
          {/* 套餐账号 */}
          <div styleName="account">
            {packageDetails.type === 1 ? (
              <p styleName="account-option-emphasis">
                {`*${formatMessage({ id: 'charge_for_the_whole_month_unit_1' })}${unit}${formatMessage({
                  id: 'charge_for_the_whole_month_unit',
                })}${formatMessage({ id: 'charge_for_the_whole_month_unit_2' })}${unit}${formatMessage({
                  id: 'charge_for_the_whole_month_unit_3',
                })}${unit}${formatMessage({ id: 'charge_for_the_whole_month_unit_4' })}`}
              </p>
            ) : (
              <p styleName="account-option">
                {formatMessage({ id: 'click_quote_price_can_charge_according_to_the_number_of_clicks' })}
              </p>
            )}
          </div>
        </div>
        {/* 套餐可用余额 */}
        <h2 styleName="title">{formatMessage({ id: 'account_info' })}</h2>
        <div styleName="order-info">
          <div styleName="expire">
            <span>
              {formatMessage({ id: 'available_balance' })}
              {/* 余额 不足 用big计算 */}
              {Big(balance).lt(Big(verify.amount)) ? (
                <span className="pl-[5px] text-center text-[24px] text-[#FF2C00]">
                  {formatMessage({ id: 'insufficient_balance' })}
                </span>
              ) : null}
            </span>
            <span styleName="expire-right">{`${toThousand(toSlice(balance))} ${packageDetails.currency}`}</span>
          </div>

          <div styleName="expire">
            <span>{formatMessage({ id: 'auto_renew' })}</span>
            {/* <span styleName="expire-right">{verify?.enableEnd}</span> */}
            <Switch
              checked={isAutoRenew}
              onChange={handleSwitchChange}
              style={{
                '--checked-color': '#00C183',
                '--height': '25px',
                '--width': '45px',
              }}
            />
          </div>
          <div styleName="option">{`*${formatMessage({ id: 'confirm_the_purchase' })}`}</div>
        </div>

        <div styleName="radio-wrap">
          <div styleName="base-warp">
            <div
              styleName="base-inform"
              onClick={() => {
                setIsConsent(!isConsent);
              }}
            >
              <Radio icon={checkIcon} checked={isConsent}>
                <span>{formatMessage({ id: 'have_read_agree' })}</span>
              </Radio>
            </div>
            <a
              onClick={(e) => {
                e.stopPropagation();
                openPage('/quotes-package-auto-renew-agreement.html?title=user_service_license_agreement');
              }}
            >
              {formatMessage({ id: 'user_service_license_agreement' })}
            </a>
            <a
              onClick={(e) => {
                e.stopPropagation();
                openPage('/quotes-package-auto-renew-agreement.html?title=auto_renew_agreement');
              }}
            >
              {formatMessage({ id: 'auto_renew_agreement' })}
            </a>
          </div>
          <div className={cn('text-[#FF2C00]', isAutoRenewalAgreement && !isConsent ? 'block' : 'hidden')}>
            {formatMessage({ id: 'please_agree_to_check' })}
          </div>
        </div>
      </div>
      {/* 底部 */}
      <div styleName="base">
        <div styleName={`tail-buy ${!isBuy ? 'prohibit-buy' : ''}`} onClick={() => (isBuy ? buyClick() : () => {})}>
          {`${packageDetails.currency} ${toThousand(toSlice(verify.amount))}`} {formatMessage({ id: 'buy_now' })}
        </div>
      </div>

      <Modal visible={isAutoRenewal} setVisible={() => setIsAutoRenewal(false)}>
        <Modal.Content>{formatMessage({ id: 'confirm_close_auto_renewal' })}</Modal.Content>
        <Modal.Actions>
          <Modal.CancelActionButton
            onClick={() => {
              setIsAutoRenewal(false);
              setIsAutoRenew(true);
            }}
          />
          <Modal.ConfirmActionButton
            onClick={() => {
              setIsAutoRenewal(false);
              setIsAutoRenew(false);
            }}
          />
        </Modal.Actions>
      </Modal>
      <Modal visible={isConfirmOrder} setVisible={() => setIsConfirmOrder(false)}>
        <Modal.Title>{formatMessage({ id: 'confirm_purchase' })}</Modal.Title>
        <Modal.Content>
          <div className={cn('text-center text-[32px] font-semibold text-[#111214]')}>
            {formatMessage({ id: 'you_confirm_purchase' })} {packageDetails.name}
          </div>
          <div className={cn('mt-[16px] text-center text-[32px] font-semibold text-[#A15700]')}>
            {`${packageDetails.currency} ${toThousand(toSlice(verify.amount))}/`}
            {unit}
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Modal.CancelActionButton onClick={() => setIsConfirmOrder(false)} />
          <Modal.ConfirmActionButton onClick={handleSubmit} loading={isLoading} />
        </Modal.Actions>
      </Modal>
    </div>
  );
};
export default QuotesPackageSubmitOrder;
