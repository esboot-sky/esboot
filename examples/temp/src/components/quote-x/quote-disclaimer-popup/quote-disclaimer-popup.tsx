import { Toast, Checkbox } from 'antd-mobile';
import { useEffect, useState, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { parseResult } from '@/api/helpers';
import { confirmQuoteDisclaimer, queryIsConfirmDisclaimer } from '@/api/quotation/query';
import BottomPopup from '@/components/bottom-popup/bottom-popup';
import { getRadioIcon } from '@/components/radio-icon';
import { lanEnum } from '@/constants/config';
import { closePage } from '@/helpers/native/msg';
import { useAppStore } from '@/model/app';

import data from './data';
import LanguageSwitch from './switch-language';

const QuoteDisclaimerPopup = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visible, setVisible] = useState(false);
  const [checked, setChecked] = useState(false);
  const isLogin = useAppStore((state) => state.isLogin);
  const [currentLanguage, setCurrentLanguage] = useState('zh-CN');
  const [showPleaseCheckError, setShowPleaseCheckError] = useState(false);

  const getCurrentContent = useMemo(() => {
    return () => {
      switch (currentLanguage) {
        case lanEnum.ZH_CN:
          return data[lanEnum.ZH_CN];
        case lanEnum.ZH_TW:
          return data[lanEnum.ZH_TW];
        case lanEnum.EN_US:
          return data[lanEnum.EN_US];
        default:
          return data[lanEnum.ZH_CN];
      }
    };
  }, [currentLanguage, data]);
  const onCheckedChange = (value: boolean) => {
    setChecked(value);

    if (value && showPleaseCheckError) {
      setShowPleaseCheckError(false);
    }
  };

  const cancel = () => {
    closePage();
  };

  const confirm = () => {
    if (isSubmitting) return;

    if (!checked) {
      setShowPleaseCheckError(true);
      return;
    }

    setIsSubmitting(true);
    confirmQuoteDisclaimer()
      .then(() => {
        setVisible(false);
      })
      .catch((error: Error) => {
        Toast.show({
          content: error.message,
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  useEffect(() => {
    if (!isLogin) return;

    queryIsConfirmDisclaimer()
      .then(parseResult)
      .then((res) => {
        const { isConfirmed } = res;

        setVisible(!isConfirmed);
      });
  }, [isLogin]);

  if (!isLogin) return null;

  return (
    <BottomPopup
      title={<FormattedMessage id="global.disclaimers" />}
      visible={visible}
      onClose={cancel}
      footer={
        <div>
          <div className="px-[32px] py-[25px] shadow-[0_-4px_6px_0_#86909c4d]">
            <Checkbox checked={checked} icon={(v: any) => getRadioIcon({ checked: v })} onChange={onCheckedChange}>
              <div className="font-regular-26">
                <FormattedMessage id="home.i_have_read_and_agree" />
              </div>
            </Checkbox>
            {showPleaseCheckError && (
              <div
                className="px-[32px] leading-[42px] text-[var(--main-warning-color)]"
                style={{
                  marginLeft: 8,
                }}
              >
                <FormattedMessage id="home.please_read_and_agree" />
              </div>
            )}
          </div>

          <div className="footer-buttons">
            <div className="footer-buttons-cancel" onClick={cancel}>
              <FormattedMessage id="global.cancel" />
            </div>
            <div className="footer-buttons-ok" onClick={confirm}>
              <FormattedMessage id="global.confirm" />
            </div>
          </div>
        </div>
      }
    >
      <div className="flex h-[inherit] flex-col overflow-auto">
        {Object.values(getCurrentContent()).map((content, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index} className="mb-0 whitespace-normal break-words">
            {content}
          </div>
        ))}
        <LanguageSwitch currentLanguage={currentLanguage} onLanguageChange={setCurrentLanguage} />
      </div>
    </BottomPopup>
  );
};

export default QuoteDisclaimerPopup;
