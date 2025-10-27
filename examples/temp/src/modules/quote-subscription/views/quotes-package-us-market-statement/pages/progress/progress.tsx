import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

// import { emitEvent } from '@/helpers/native/msg';
import { openQuotesPackagesPage } from '@/helpers/native/url';
import AuditFailed from '@/modules/quote-subscription/images/audit-failed.svg';
import AuditProcessing from '@/modules/quote-subscription/images/audit-processing.svg';
import AuditSuccessful from '@/modules/quote-subscription/images/audit-successful.svg';

import { ProgressTypes, StatementRouter } from '../../constant/const';
import useProgress from '../../hooks/use-progress';

import './progress.scss';

const Progress = () => {
  const { progress } = useProgress();
  // const progress = ProgressTypes.SUCCESS;
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const progressData = useMemo(() => {
    const obj: any = {
      title: '',
      description: '',
      icon: null,
      btn: '',
    };
    if (progress === ProgressTypes.REVIEW_ING) {
      // 审核中
      obj.title = formatMessage({ id: 'us-stock-quotes.declaration_submitted' });
      obj.description = formatMessage({ id: 'us-stock-quotes.under_review' });
      obj.icon = <AuditProcessing styleName="progress-icon" />;
      obj.btn = '';
    } else if (progress === ProgressTypes.SUCCESS) {
      // 审核成功
      obj.title = formatMessage({ id: 'us-stock-quotes.declaration_completed' });
      obj.description = formatMessage({ id: 'us-stock-quotes.pass_the_audit' });
      obj.icon = <AuditSuccessful styleName="progress-icon" />;
      obj.btn = formatMessage({ id: 'us-stock-quotes.go_to_market_mall' });
    } else if (progress === ProgressTypes.REJECT) {
      // 审核失败
      obj.title = formatMessage({ id: 'us-stock-quotes.declaration_submitted' });
      obj.description = formatMessage({ id: 'us-stock-quotes.review_failed' });
      obj.icon = <AuditFailed styleName="progress-icon" />;
      obj.btn = formatMessage({ id: 'us-stock-quotes.re_fill' });
    }
    return obj;
  }, [progress]);

  const nextTick = () => {
    if (progress === ProgressTypes.REJECT) {
      navigate(StatementRouter.STATEMENT_PERSONAL_DATA);
      return;
    }
    // emitEvent('US_MARKET_STATEMENT_STATUS_UPDATE', 'SUCCESS');
    openQuotesPackagesPage();
  };
  return (
    <div styleName="progress-page">
      <div styleName="progress-icon-box">{progressData.icon}</div>
      <div styleName="progress-title">{progressData.title}</div>
      <div styleName="progress-description">{progressData.description}</div>
      <div styleName="progress-btn-box">
        {progressData.btn ? (
          <div styleName="progress-btn" onClick={nextTick}>
            {progressData.btn}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Progress;
