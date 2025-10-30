import { cn } from '@dz-web/esboot-browser';
import { toSlice, toThousand } from '@dz-web/o-orange';
import { Toast } from 'antd-mobile';
import cx from 'classnames';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSearchParam } from 'react-use';

import { requestCancelRenew, requestQuoList, IQuoList, AuthProgress } from '@/api/quotation/query';
import Empty from '@/components/empty/empty';
import Loading from '@/components/loading/loading';
import Modal from '@/components/modal/modal';
import Tab from '@/components/tab/tab';
import { marketType, MarketTypeList } from '@/constants/quotation';
import { openPage } from '@/helpers/native/url';
import arrowRight from '@/images/icon_more.svg?url';
import useProgress from '@/modules/quote-subscription/hooks/use-progress';
import { count } from '@/modules/quote-subscription/utils/share';

import autoDesc from '../../images/white/icon_desc.svg?url';

import './index.scss';

const { memo, useEffect, useState, useMemo, useRef } = React;

const US_MARKET_STATEMENT_PAGE = '/quotes-package-us-market-statement.html#/';
// 定义认证进度与目标页面的映射关系（键：进度值，值：页面路径）
const progressToPageMap = {
  [AuthProgress.AUTH_DATA]: `${US_MARKET_STATEMENT_PAGE}home`,
  [AuthProgress.USER_DATA]: `${US_MARKET_STATEMENT_PAGE}personal-data`,
  [AuthProgress.ANSWER]: `${US_MARKET_STATEMENT_PAGE}survey`,
  [AuthProgress.REVIEW_ING]: `${US_MARKET_STATEMENT_PAGE}progress`,
  [AuthProgress.REJECT]: `${US_MARKET_STATEMENT_PAGE}progress`,
};

const PackageItem: React.FC<{ onRefresh: (isRefresh: boolean) => void; isRefresh: boolean }> = ({
  onRefresh,
  isRefresh,
}) => {
  const { formatMessage } = useIntl();
  const piProgress = useProgress();
  const searchStr = useSearchParam('active') || marketType.HK;
  // 请求套餐列表
  const [quoList, setQuoList] = useState<IQuoList[]>([]);
  const [isReload, setIsReload] = useState(false);

  const [activeTab, setActiveTab] = useState<string>(searchStr);

  const [isLoad, setIsLoad] = useState(true);

  // 当piProgress加载完成后，检查US认证状态并处理跳转
  useEffect(() => {
    if (!piProgress.authProgress) return;
    if (searchStr === marketType.US && piProgress.authProgress !== AuthProgress.SUCCESS) {
      jumpToUpdateProfessionalCertification();
      // 如果不是审核通过状态，则切换到HK
      if (activeTab === marketType.US) {
        setActiveTab(marketType.HK);
      }
    }
  }, [piProgress.authProgress, searchStr]);

  useEffect(() => {
    const getRequest = async () => {
      setIsLoad(true);
      try {
        const quoData = await requestQuoList({ marketType: activeTab });
        if (quoData?.code === 0) {
          // 数据多增加几条
          setQuoList(quoData.result);
        }
        setIsLoad(false);
      } catch (error) {
        setQuoList([]);
        setIsLoad(false);
      }
    };
    getRequest();
  }, [isReload, activeTab, isRefresh]);

  // 点击取消自动续订的请求
  const Cancel = () => {
    requestCancelRenew({ packageId: idRef.current }).then((res) => {
      if (res?.code === 0) {
        Toast.show({ content: formatMessage({ id: 'p1' }) });
        setVisible(false);
        setIsReload(!isReload);
        onRefresh(!isRefresh);
      } else {
        Toast.show({ content: res?.message });
      }
    });
  };
  // 显示取消续订弹框
  const [visible, setVisible] = useState(false);
  const idRef = useRef('');
  // 点击事件的判断
  const isAutoRenewClick = (item: IQuoList) => {
    // 点击取消自动续订的操作
    if (item.autoRenew) {
      setVisible(true);
      idRef.current = item.id;
    } else {
      // LocalCache.setCache('registerId', item.id);
      // 如果是点击订购就跳转到订购详情页
      openPage(`/quotes-package-details.html?registerId=${item.id}`);
    }
  };

  // 显示套餐item
  const showPackageItem = useMemo(
    () =>
      quoList.map((item) => {
        const buttonStyle = item.autoRenew ? 'item-button button-renewal' : 'item-button button-order';
        return (
          <div styleName="item" key={item?.id}>
            <div styleName="item-top">
              <div styleName="item-name">{item?.name}</div>
              <div styleName="item-option">{item?.description}</div>
              <div
                styleName="item-sum"
                className={cx(item.hasSpecial && 'old-price fix-font-family', 'fix-font-family')}
              >
                <span styleName="sum-currency">{item.currency}</span>
                <span>{toThousand(toSlice(item?.price))}</span>
                <span>/</span>
                <span>{count[item.count as keyof typeof count]}</span>
              </div>
              {item.hasSpecial && (
                <div styleName="item-sum" className="fix-font-family">
                  <span styleName="special">{formatMessage({ id: 'special_price' })}</span>
                  <span styleName="sum-currency">{item.currency}</span>
                  <span>{toThousand(toSlice(item?.specialPrice))}</span>
                  <span>/</span>
                  <span>{count[item.count as keyof typeof count]}</span>
                </div>
              )}
            </div>
            <div styleName="item-bottom">
              {item?.autoRenew ? (
                <div className={cn('flex items-center gap-[10px]')}>
                  <img src={autoDesc} alt="" className={cn('h-[28px] w-[28px]')} />
                  <p className={cn('font-400 text-[24px] text-[#ee8131]')}>{formatMessage({ id: 'auto_renewal' })}</p>
                </div>
              ) : (
                <div />
              )}
              <div
                styleName={buttonStyle}
                onClick={() => {
                  isAutoRenewClick(item);
                }}
              >
                {item?.autoRenew ? formatMessage({ id: 'cancel_renewal' }) : formatMessage({ id: 'subscription' })}
              </div>

              <span styleName="left" />
              <span styleName="right" />
            </div>
          </div>
        );
      }),
    [quoList],
  );

  const jumpToUpdateProfessionalCertification = (isUpdate = false) => {
    // 特殊情况：不能点击更新专业认证，直接返回
    if (piProgress.authProgress === AuthProgress.REVIEW_ING && isUpdate) {
      return false;
    }
    // 特殊情况：认证成功，直接跳转
    if (piProgress.authProgress === AuthProgress.SUCCESS && isUpdate) {
      openPage(`${US_MARKET_STATEMENT_PAGE}personal-data`);
      return true;
    }
    // 根据认证进度获取目标页面，执行跳转
    const targetPage = progressToPageMap[piProgress.authProgress as keyof typeof progressToPageMap];
    if (targetPage) {
      openPage(targetPage);
      return false;
    }
    return true;
  };

  const isShowUpdateTip = useMemo(() => {
    return quoList.length > 0 && quoList.length >= 3;
  }, [quoList]);

  return (
    <div styleName="package-wrap">
      <div styleName="package-option">{formatMessage({ id: 'quote_package_order' })}</div>
      <Tab
        list={MarketTypeList}
        activeValue={activeTab}
        onClick={(value) => {
          // 如果切换到US，则需要判断是否需要更新专业认证
          if (value === marketType.US) {
            const isJump = jumpToUpdateProfessionalCertification();
            if (!isJump) {
              return;
            }
          }
          setActiveTab(value);
        }}
      />
      <div styleName="content">
        {(() => {
          if (isLoad) {
            return <Loading />;
          }
          if (quoList.length > 0) {
            return showPackageItem;
          }
          return <Empty text={formatMessage({ id: 'no_package' })} />;
        })()}
      </div>

      {activeTab === marketType.US ? (
        <div styleName={isShowUpdateTip ? 'update-tip-relative' : 'update-tip-fixed'}>
          {formatMessage({ id: 'update_tip' })}
          <span
            onClick={(e) => {
              e.stopPropagation();
              jumpToUpdateProfessionalCertification(true);
            }}
          >
            {formatMessage({ id: 'update_tip_span' })}
            <img src={arrowRight} alt="" className={cn('ml-[5px] inline-block w-[11px]')} />
          </span>
        </div>
      ) : null}

      <Modal visible={visible} setVisible={() => setVisible(false)}>
        <Modal.Content>{formatMessage({ id: 'p2' })}</Modal.Content>
        <Modal.Actions>
          <Modal.CancelActionButton onClick={() => setVisible(false)} />
          <Modal.ConfirmActionButton onClick={Cancel} />
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default memo(PackageItem);
