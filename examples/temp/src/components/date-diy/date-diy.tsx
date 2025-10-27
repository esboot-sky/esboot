/* eslint-disable consistent-return */
import { DatePickerView, Toast, Popup } from 'antd-mobile';
import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

// import Divider from '../divider/divider';
import './date-diy.scss';
import IconClose from './images/close.svg?url';

/**
 * 时间转换
 * @param date
 * @param formatter
 * @returns
 */
export function dateToString(date: Date, formatter = 'yyyy/MM/dd'): string {
  let str = formatter;

  const y = String(date?.getFullYear() || 0);
  const m = String((date?.getMonth() || 0) + 1).padStart(2, '0');
  const d = String(date?.getDate() || 0).padStart(2, '0');

  str = str.replace('yyyy', y);
  str = str.replace('MM', m);
  str = str.replace('dd', d);
  return str;
}

type shortcut = 'all' | 'today' | 'weekly' | 'monthly' | 'threeMonthly' | 'halfMonthly' | 'custom';

interface IDefaultDate {
  start?: Date;
  end?: Date;
  type?: string;
  label?: string | React.ReactNode;
  [s: string]: any;
}

export interface IComplete {
  start?: Date; // 开始时间
  end?: Date; // 结束时间
  isAll?: boolean;
  label?: string | React.ReactNode;
  type: string;
}

type defaultProps = {
  defaultDate: IDefaultDate; // 默认日期
  isHideAll: boolean; // 是否隐藏全部
  separateText: string | React.ReactNode; // 分隔符号
  title: string | React.ReactNode; // 标题名称 - 自带关闭不想封装了
  formatter: string; // 时间显示格式 yyyy/MM/dd 为默认 yyyy 表示年 MM表示月 dd表示日期
  // customDateLength: string; // 时间跨度
  className: string;
  hitherto: boolean; // 显示至今
  resetAll?: shortcut; // 重置是不是要返回三个月
};

type IProps = {
  children: React.ReactNode; // 由用户自定义展示方式（文案、位置、颜色等等）
  isShowContent: boolean; // 是否显示日期筛选内容区
  onClose: () => void; // 关闭日期筛选内容区
  onComplete: (newDate: IComplete) => void; // 完成
  shortcutOption: shortcut[]; // 快捷日期选项
} & Partial<defaultProps>;

/**
 * 中文和英文的对应
 */
export const dateText: Record<string, React.ReactElement> = {
  all: <FormattedMessage id="global.all" />,
  weekly: <FormattedMessage id="trade.weekly" />,
  monthly: <FormattedMessage id="trade.monthly" />,
  threeMonthly: <FormattedMessage id="trade.threeMonthly" />,
  today: <FormattedMessage id="global.today" />,
  halfMonthly: <FormattedMessage id="trade.halfMonthly" />,
  custom: <FormattedMessage id="global.custom" />,
};

const DateDiy: React.FC<IProps> = ({
  children,
  isShowContent,
  onClose,
  onComplete,
  shortcutOption,
  defaultDate = { type: 'all' },
  isHideAll = false,
  separateText = <div styleName="separate" />,
  formatter = 'yyyy/MM/dd',
  className = '',
  hitherto = false,
  resetAll = 'threeMonthly',
}) => {
  const { formatMessage } = useIntl();

  const labelRenderer = useCallback(
    (type: string, data: number) => {
      switch (type) {
        case 'year':
          return data + formatMessage({ id: 'global.year' });
        case 'month':
          return data + formatMessage({ id: 'global.month' });
        case 'day':
          return data + formatMessage({ id: 'global.day' });
        case 'hour':
          return data + formatMessage({ id: 'global.hour' });
        case 'minute':
          return data + formatMessage({ id: 'global.minute' });
        case 'second':
          return data + formatMessage({ id: 'global.second' });
        default:
          return data;
      }
    },
    [formatMessage],
  );

  const getDateParams = useCallback((type: shortcut): IComplete | undefined => {
    if (type === 'custom') return;
    const currentDate = new Date();
    const shortcutObj: Record<string, IComplete> = {
      all: {
        isAll: true,
        label: <FormattedMessage id="global.all" />,
        type: 'all',
        start: currentDate,
        end: currentDate,
      },
      weekly: {
        start: new Date(currentDate.getTime() - 60 * 60 * 24 * 6 * 1000),
        end: currentDate,
        type: 'weekly',
        label: <FormattedMessage id="trade.weekly" />,
      },
      monthly: {
        start: new Date(currentDate.getTime() - 60 * 60 * 24 * 30 * 1000),
        end: currentDate,
        type: 'monthly',
        label: <FormattedMessage id="trade.monthly" />,
      },
      threeMonthly: {
        start: new Date(currentDate.getTime() - 60 * 60 * 24 * 30 * 3 * 1000),
        end: currentDate,
        type: 'threeMonthly',
        label: <FormattedMessage id="trade.threeMonthly" />,
      },
      today: {
        start: currentDate,
        end: currentDate,
        type: 'today',
        label: <FormattedMessage id="global.today" />,
      },
      halfMonthly: {
        start: new Date(currentDate.getTime() - 60 * 60 * 24 * 15 * 1000),
        end: currentDate,
        type: 'halfMonthly',
        label: <FormattedMessage id="trade.halfMonthly" />,
      },
    };

    return shortcutObj[type];
  }, []);

  // 自定义模块的起止时间
  const [startEndDate, setStartEndDate] = useState<IComplete>({
    start: new Date(),
    end: new Date(),
    type: 'custom',
  });
  // 自定义模块的当前日期位置： 开始 or 结束
  const [datePosition, setDatePosition] = useState('start');
  // 自定义模块的DatePicker所选日期
  const [DatePickerValue, setDatePickerValue] = useState(startEndDate.start || new Date());
  // 自定义模块的时间change handle
  const datePickerChange = (date: Date) => {
    if (datePosition === 'start') {
      setStartEndDate({ ...startEndDate, start: date, type: 'custom' });
    } else if (datePosition === 'end') {
      setStartEndDate({ ...startEndDate, end: date, type: 'custom' });
    }
    setDatePickerValue(date);
  };

  // 时间简称单击句柄
  const shortcutClick = (item: shortcut) => {
    // if (e.target === e.currentTarget) return;
    const date = getDateParams(item);

    if (!date) return;

    if (date.isAll) {
      onClose();
      return;
    }
    const { start, end, type, label } = date;
    setStartEndDate({ start, end, type, label });
    setDatePickerValue(start || new Date());
    // onComplete({ start, end, type, label });
    // onClose();
  };

  useEffect(() => {
    if (defaultDate.start && defaultDate.end) {
      setStartEndDate({
        start: defaultDate.start,
        end: defaultDate.end,
        type: defaultDate.type || 'custom',
        label: defaultDate.label,
      });
    }
  }, [defaultDate]);

  const toCancel = () => {
    const currentDate = new Date();
    // 出厂数据
    let factoryData: IComplete = {
      start: new Date(currentDate.getTime() - 60 * 60 * 24 * 6 * 1000),
      end: currentDate,
      type: 'weekly',
      label: <FormattedMessage id="trade.weekly" />,
    };

    if (resetAll) {
      const resetData = getDateParams(resetAll);
      if (resetData) {
        factoryData = resetData;
      }
    }

    // if (resetAll === 'all') {
    //   factoryData = {
    //     start: '',
    //     end: currentDate,
    //     label: <FormattedMessage id="threeMonthly" />,
    //     type: 'threeMonthly',
    //   };
    // }

    setStartEndDate(factoryData);
    setDatePickerValue(factoryData.start || new Date());
    // onComplete(factoryData);
    // onClose();
  };
  const toComplete = () => {
    const { start, end } = startEndDate;
    if (start && end && start > end) {
      Toast.show(formatMessage({ id: 'trade.endBigStart' }));
      return;
    }
    setStartEndDate({ ...startEndDate });
    onComplete({ ...startEndDate });
    onClose();
  };

  const showOptionItem = (item: shortcut) => {
    if (item !== 'all' || (item === 'all' && !isHideAll)) {
      return (
        <span
          styleName={startEndDate?.type === item ? 'active-button' : ''}
          key={item}
          onClick={() => {
            shortcutClick(item);
          }}
        >
          {dateText[item] || item}
        </span>
      );
    }
    return '';
  };

  useEffect(() => {
    if (isShowContent && defaultDate.start && defaultDate.end) {
      setStartEndDate({
        start: defaultDate.start,
        end: defaultDate.end,
        type: defaultDate.type || 'custom',
        label: defaultDate.label,
      });
    }
  }, [isShowContent, defaultDate]);

  return (
    <>
      {children}
      {/* {isShowContent ? ( */}
      <Popup
        className={className}
        visible={isShowContent}
        onMaskClick={() => {
          onClose();
        }}
        maskStyle={{
          backgroundColor: 'rgba(0, 0, 0, .5)',
        }}
        bodyStyle={{
          minHeight: '40vh',
          // borderTopLeftRadius: '.06rem',
          // borderTopRightRadius: '.06rem',
        }}
      >
        <div styleName="content">
          <div styleName="title">
            <span>{formatMessage({ id: 'trade.date_filter' })}</span>
            <img
              onClick={() => {
                onClose();
              }}
              src={IconClose}
              alt=""
            />
          </div>
          <div styleName="shortcut">{shortcutOption.map(showOptionItem)}</div>
          <div styleName="custom">
            {/* 时间区间显示 */}
            <div styleName="start-end">
              <div
                styleName={datePosition === 'start' ? 'start active' : 'start'}
                onClick={() => {
                  setDatePosition('start');
                  setDatePickerValue(startEndDate.start || new Date());
                }}
              >
                {dateToString(startEndDate.start || new Date(), formatter)}
              </div>
              <div>{separateText}</div>
              {hitherto ? (
                <div styleName="end">
                  <FormattedMessage id="trade.hitherto" />
                </div>
              ) : (
                <div
                  styleName={datePosition === 'end' ? 'end active' : 'end'}
                  onClick={() => {
                    setDatePosition('end');
                    setDatePickerValue(startEndDate.end || new Date());
                  }}
                >
                  {dateToString(startEndDate.end || new Date(), formatter)}
                </div>
              )}
            </div>
            {/* 时间选框 */}
            <DatePickerView
              value={DatePickerValue}
              onChange={(d) => datePickerChange(d)}
              max={new Date()}
              renderLabel={labelRenderer}
            />
            {/* 按钮功能区 */}
            <div styleName="confirm-box">
              <div styleName="cancel" onClick={toCancel}>
                <FormattedMessage id="global.reset" />
              </div>
              <div styleName="line" />
              <div styleName="complete" onClick={toComplete}>
                <FormattedMessage id="global.confirm" />
              </div>
            </div>
          </div>
        </div>
      </Popup>
      {/* ) : null} */}
    </>
  );
};

export default DateDiy;
