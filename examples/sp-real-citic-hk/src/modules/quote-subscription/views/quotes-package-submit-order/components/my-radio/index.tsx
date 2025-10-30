/* eslint-disable import/no-unresolved */
/* eslint-disable no-confusing-arrow */
/* eslint-disable implicit-arrow-linebreak */
import { Radio } from 'antd-mobile';
import * as React from 'react';

import IconCheck from '@/images/check.svg?url';

import './index.scss';

const { memo } = React;

interface IProps {
  isCheck: boolean;
  setIsCheck: any;
  text: any;
}
const checkIcon = (checked) =>
  checked ? <img styleName="radio-check-img" src={IconCheck} alt="" /> : <div styleName="no-check-circle" />;

const MyRadio: React.FC<IProps> = (props) => {
  const { isCheck, setIsCheck, text } = props;
  return (
    <div
      styleName="base-inform"
      onClick={(e) => {
        setIsCheck(!isCheck);
        console.log(e);
      }}
    >
      <Radio icon={checkIcon} checked={isCheck} className="radio">
        <div styleName="content">{text}</div>
      </Radio>
    </div>
  );
};

export default memo(MyRadio);
