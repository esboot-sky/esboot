import { clsx } from '@dz-web/esboot-browser';
import { Checkbox } from 'antd-mobile';
import { CheckboxValue } from 'antd-mobile/es/components/checkbox';
import React, { memo, ReactNode } from 'react';

import './check-box.scss';
import IconCheckedPath from './icons/checked-path.svg';

interface IProps {
  children?: ReactNode | null;
  value?: CheckboxValue | undefined;
  disabled?: boolean;
  checked?: boolean | undefined;
  onChange?: (val: boolean) => void | undefined;
  className?: string;
}

const CheckBox: React.FC<IProps> = ({ children, value, disabled, checked, onChange, className }) => {
  function renderCheckIcon(checkbool: boolean): ReactNode {
    return (
      <div styleName={clsx('check-box', { checked: checkbool })}>
        {checkbool && <IconCheckedPath className="h-[22px] w-[22px]" />}
      </div>
    );
  }

  return (
    <Checkbox
      value={value}
      icon={(checkbool) => renderCheckIcon(checkbool)}
      disabled={disabled}
      onChange={onChange}
      checked={checked}
      className={className}
    >
      {children}
    </Checkbox>
  );
};

export default memo(CheckBox);
