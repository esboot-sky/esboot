import { Dialog, Toast } from 'antd-mobile';
import React from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { requestAuthData } from '@/api/quotation/market-statement';
import { back } from '@/helpers/native/msg';
import Logo from '@/modules/quote-subscription/images/logo.png';

import { ProgressTypes, StatementRouter } from '../../constant/const';
import useProgress from '../../hooks/use-progress';

import './home.scss';

const StatementHome = () => {
  const { formatMessage } = useIntl();
  const { progress } = useProgress();

  const navigate = useNavigate();

  const getAuth = async () => {
    try {
      const res = await requestAuthData();
      if (res.code === 0) {
        navigate(`${StatementRouter.STATEMENT_PERSONAL_DATA}?source=internal`);
      }
    } catch (error: any) {
      console.log('requestAuthData>>>', error);
      Toast.show({
        icon: 'fail',
        content: error.message || error.msg,
      });
    }
  };
  // settingNavigationTitle({ title: formatMessage({ id: 'us-stock-quotes.page_title' }) });
  const nextBtn = () => {
    if (progress !== ProgressTypes.AUTH_DATA) {
      navigate(`${StatementRouter.STATEMENT_PERSONAL_DATA}?source=internal`);
      return;
    }
    Dialog.confirm({
      className: 'market-statement-popup',
      title: formatMessage({ id: 'us-stock-quotes.tips' }),
      content: formatMessage({ id: 'us-stock-quotes.tips_content' }),
      cancelText: formatMessage({ id: 'us-stock-quotes.disagree' }),
      confirmText: formatMessage({ id: 'us-stock-quotes.agree' }),
      onCancel: () => {
        // navigate(-1);
        back();
      },
      onConfirm: () => {
        getAuth();
      },
    });
  };
  return (
    <div styleName="statement-home">
      <div styleName="logo-box ">
        <img src={Logo} alt="Logo" />
      </div>

      <div styleName="title">{formatMessage({ id: 'us-stock-quotes.home_title' })}</div>
      <div styleName="subtitle">{formatMessage({ id: 'us-stock-quotes.home_subtitle' })}</div>

      <div styleName="description">{formatMessage({ id: 'us-stock-quotes.home_description' })}</div>

      <div styleName="next-button">
        <div styleName="button" onClick={nextBtn}>
          下一步
        </div>
      </div>
    </div>
  );
};

export default StatementHome;
