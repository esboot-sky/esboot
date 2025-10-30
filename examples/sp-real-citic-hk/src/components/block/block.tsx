import classNames from 'classnames';
import { PropsWithChildren } from 'react';

import './block.scss';

interface BlockProps {
  className?: string;
  isFirst?: boolean;
  styleName?: string;
  contentClassName?: string;
}

export function Block(props: PropsWithChildren<BlockProps>) {
  const { children, className, styleName, contentClassName, isFirst = false } = props;
  return (
    <div styleName={classNames('block', { 'not-first': !isFirst }, styleName)} className={className}>
      <div styleName="block-content" className={contentClassName}>
        {children}
      </div>
    </div>
  );
}
