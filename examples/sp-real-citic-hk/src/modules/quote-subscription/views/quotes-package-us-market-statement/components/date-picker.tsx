import { DatePickerView, Popup } from 'antd-mobile';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import CloseIcon from '@/modules/quote-subscription/images/icon_close.svg';

import './date-picker.scss';

interface DatePickerProps {
  visible: boolean;
  value?: string;
  dateChange?: (value: string) => void;
  close: () => void;
}
const DatePicker = ({ visible, value = '', dateChange, close }: DatePickerProps) => {
  const { formatMessage } = useIntl();
  const [dateValue, setDatetValue] = useState(new Date());
  useEffect(() => {
    if (!value) {
      setDatetValue(new Date());
    } else {
      setDatetValue(dayjs(value).toDate());
    }
  }, [value]);
  const confirm = () => {
    const date = dayjs(dateValue).format('YYYY-MM-DD');
    dateChange?.(date);
  };
  return (
    <Popup visible={visible} key="date" className="select-popup" destroyOnClose onClose={close}>
      <div styleName="select-popup-box">
        <div styleName="select-popup-title">
          <span>{formatMessage({ id: 'us-stock-quotes.please_select' })}</span>
          <p onClick={close}>
            <CloseIcon />
          </p>
        </div>
        <div styleName="select-popup-content">
          <DatePickerView
            value={dateValue}
            max={new Date()}
            min={dayjs('1900-01-01').toDate()}
            onChange={(val) => {
              console.log(val);
              setDatetValue(val);

              // setFormData({ ...formData, birthDate: val });
            }}
          />
        </div>
        <div styleName="select-popup-button">
          <div styleName="select-popup-button-bold">{formatMessage({ id: 'us-stock-quotes.reset' })}</div>
          <div styleName="select-popup-button-bold confirm" onClick={confirm}>
            {formatMessage({ id: 'us-stock-quotes.confirm' })}
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default DatePicker;
