/* eslint-disable operator-linebreak */
import { DatePickerView, Popup } from 'antd-mobile';
import * as React from 'react';
import { useIntl } from 'react-intl';

import './index.scss';

interface IProps {
  className?: string;
  onChange: (val: Date) => void;
  visible: boolean;
  setVisible: any;
}

const { useState } = React;

const labelRenderer = (type: string, data: number) => {
  switch (type) {
    case 'year':
      return `${data}年`;
    case 'month':
      return `${data}月`;
    case 'day':
      return `${data}日`;
    case 'hour':
      return `${data}时`;
    case 'minute':
      return `${data}分`;
    case 'second':
      return `${data}秒`;
    default:
      return data;
  }
};

const PopupTime: React.FC<IProps> = (props) => {
  const { children, className = '', onChange, visible, setVisible } = props;
  // const [visible, setVisible] = React.useState(false);

  function onClose() {
    setVisible(false);
  }
  const [dateVal, setDateVal] = useState<Date>();
  const { formatMessage } = useIntl();
  return (
    <>
      <div className={className}>{children}</div>
      <Popup
        visible={visible}
        onMaskClick={() => {
          onClose();
        }}
        bodyStyle={{
          borderTopLeftRadius: '.06rem',
          borderTopRightRadius: '.06rem',
        }}
      >
        <div styleName="content">
          <div styleName="title">{formatMessage({ id: 'time_selection' })}</div>
          <div>
            <DatePickerView
              min={new Date()}
              defaultValue={new Date()}
              renderLabel={labelRenderer}
              onChange={(val) => {
                setDateVal(val);
              }}
            />
          </div>
          {/* 按钮功能区 */}
          <div styleName="confirm-box">
            <div styleName="cancel" onClick={onClose}>
              重置
            </div>
            <div />
            <div
              styleName="complete"
              onClick={() => {
                onChange(dateVal);
                onClose();
              }}
            >
              完成
            </div>
          </div>
        </div>
      </Popup>
    </>
  );
};

PopupTime.defaultProps = {
  className: '',
};

export default PopupTime;
