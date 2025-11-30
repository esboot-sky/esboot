/**
 * 编辑分组名称的组件
 */
import { Input } from 'antd-mobile';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

import MaskContent from '@/components/mask-content/mask-content';
// import { calculateStrLen } from '@/utils';
import useWatchlist from '@/hooks/quote/use-watchlist';
import IconClear from '@/images/common/icon_clear_24.svg?url';

import './calculate-input.scss';

interface IProps {
  maskTitle?: string | any;
  visible: boolean;
  setVisible: (v: boolean) => void;
  confirmText?: string;
  defaultValue?: string | undefined;
  confirmAction?: (val: string) => void | undefined;
  // currentGroupName?: string[];
}

const CalculateInput: React.FC<IProps> = ({
  maskTitle,
  visible,
  setVisible,
  confirmText,
  defaultValue,
  confirmAction,
  // currentGroupName,
}) => {
  const { watchListGroups } = useWatchlist();
  const [inpValue, setInputValue] = useState('');
  const [tips, setTips] = useState('');
  const { formatMessage } = useIntl();
  // const numRef = useRef<number>(0);

  const confirmDisabled: boolean = useMemo(
    // () => !inpValue || !!currentGroupName?.includes(inpValue),
    () => !inpValue,
    // [inpValue, currentGroupName],
    [inpValue],
  );

  function getChangeValue(val: string): boolean {
    // const replaceStr = val.replace(/[^a-zA-Z\d\u4E00-\u9FA5]/g, '');
    if (/[^a-z\d\u4E00-\u9FA5]/i.test(val)) {
      setTips(formatMessage({ id: 'watchlist.inp_value_tip_1' }));
      // setTips('只能输入英文字母、数字、中文');
      return true;
    }
    if (val.length > 12) {
      // setTips('最多输入6个汉字/12个字符');
      setTips(formatMessage({ id: 'watchlist.inp_value_tip_3' }));

      return true;
      // let str = '';
      // replaceStr?.split('')?.forEach((k :string) => {
      //   if (numRef.current < 12) {
      //     if (/[\u4e00-\u9fa5]/.test(k)) {
      //       numRef.current += 2;
      //       str += k;
      //     }
      //     if ((/[a-z]/i).test(k)) {
      //       numRef.current += 1;
      //       str += k;
      //     }
      //     if (/\d/.test(k)) {
      //       numRef.current += 1;
      //       str += k;
      //     }
      //   }
      // });
      // console.log(numRef.current, ',___numRef.current');
      // if (numRef.current > 0) {
      //   replaceStr = str;
      //   numRef.current = 0;
      // }
    }
    // 修改为从本地判断是否存相同名称的分组
    if (watchListGroups.find(group => group.name === val.trim())) {
      setTips(formatMessage({ id: 'watchlist.name_conflict' }));
      return true;
    }
    // if (currentGroupName?.includes(replaceStr)) {
    //   // setTips('此名称已存在, 请修改');
    //   setTips(formatMessage({ id: 'watchlist.name_conflict' }));

    //   return true;
    // }
    return false;
  }

  const closeMask = useCallback(() => {
    setVisible(false);
    if (defaultValue)
      return;
    setInputValue('');
    setTips('');
  }, [defaultValue]);

  useEffect(() => {
    setInputValue(defaultValue || '');
  }, [defaultValue]);

  useEffect(() => {
    if (visible)
      return;
    setTips('');
    setInputValue(defaultValue || '');
  }, [visible, defaultValue]);

  return (
    <MaskContent
      showCloseBtn={false}
      styles={{ padding: '0', height: 'auto' }}
      visible={visible}
      content={(
        <>
          <div styleName="new-group-box">
            <p styleName="mask-title">{maskTitle}</p>
            <div styleName="inp-box">
              <Input
                type="text"
                placeholder={formatMessage({ id: 'watchlist.please_input_groupName_max_12' })}
                value={inpValue}
                onChange={(val) => {
                  // getChangeValue(val);
                  setInputValue(val);
                }}
                autoFocus
              />
              {inpValue && (
                <div
                  styleName="clear"
                  onClick={() => {
                    setInputValue('');
                    setTips('');
                  }}
                >
                  <img src={IconClear} alt="" />
                </div>
              )}
              {tips && <div styleName="inp-tips">{tips}</div>}
            </div>
          </div>
          <div styleName="new-group-btn">
            <input
              styleName="cancel"
              type="button"
              value={formatMessage({ id: 'global.cancel' })}
              onClick={() => closeMask()}
            />
            <span styleName="line" />
            <input
              onClick={() => {
                if (confirmAction) {
                  if (defaultValue === inpValue) {
                    setVisible(false);
                    return;
                  }

                  const isUnAccess = getChangeValue(inpValue);
                  if (!isUnAccess) {
                    confirmAction(inpValue);
                    setInputValue('');
                    setTips('');
                  }
                }
              }}
              styleName="confirm"
              disabled={confirmDisabled}
              type="button"
              value={confirmText}
            />
          </div>
        </>
      )}
      setVisible={(v) => {
        setVisible(v);
        setTips('');
        setInputValue('');
      }}
      color="rgba(12, 18, 32, 50%)"
    />
  );
};

// CalculateInput.defaultProps = {
//   maskTitle: <FormattedMessage id="new_create_groups" />,
//   confirmText: '确定',
//   defaultValue: '',
//   confirmAction: undefined,
//   currentGroupName: [],
// };

export default CalculateInput;
