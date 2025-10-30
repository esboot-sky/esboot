import { Input } from 'antd-mobile';
import React, { memo } from 'react';

import { useAppStore } from '@/model/app';

import addBlank from '../../images/blank/add.svg?url';
import decBlank from '../../images/blank/dec.svg?url';
import addWhite from '../../images/white/add.svg?url';
import decWhite from '../../images/white/dec.svg?url';

import './index.scss';

interface IProps {
  current: number;
  setCurrent: any;
}

const MyInput: React.FC<IProps> = (props) => {
  const { current, setCurrent } = props;
  // const userConfig = useContextSelector(userConfigContext, (state) => state);
  // const { theme } = userConfig;
  const theme = useAppStore((state) => state.theme);
  // const downIcon = React.useMemo(() => (theme === 'dark' ? downBlank : downWhite), [theme]);
  return (
    <div styleName="click-wrap">
      <img
        alt=""
        src={theme === 'dark' ? decBlank : decWhite}
        styleName="market-click"
        // disabled={current <= 1}
        // type="submit"
        onClick={() => {
          if (current >= 2) {
            setCurrent(current - 1);
          }
        }}
      />

      <Input
        className="my-input"
        style={{
          '--text-align': 'center',
        }}
        type="number"
        value={String(current)}
        onChange={(val) => {
          if (Number(val) <= 0) {
            setCurrent(0);
            return;
          }
          setCurrent(Number(val));
        }}
      />
      <img
        alt=""
        src={theme === 'dark' ? addBlank : addWhite}
        styleName="market-click"
        onClick={() => {
          setCurrent(current + 1);
        }}
      />
    </div>
  );
};

export default memo(MyInput);
