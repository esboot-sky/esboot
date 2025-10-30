import classNames from 'classnames';
import { ReactNode } from 'react';

import './tab.scss';

interface TabProps {
  list: {
    label: ReactNode;
    value: string;
  }[];
  activeValue: string;
  onClick?: (value: string) => void;
}

const Tab = (props: TabProps) => {
  const { list, activeValue, onClick } = props;

  return (
    <div>
      <ol styleName="tab-list">
        {list.map((item) => (
          <li
            key={item.value}
            styleName={classNames('tab-item', { active: item.value === activeValue })}
            onClick={() => {
              onClick?.(item.value);
            }}
          >
            {item.label}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Tab;
