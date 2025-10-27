import { clsx } from '@dz-web/esboot-browser';
import { HTMLAttributes, memo, ReactNode } from 'react';

import IconMore from './icon-more.svg';

export interface NavBlockProps extends HTMLAttributes<HTMLDivElement> {
  title: ReactNode;
  onMoreClick?: () => void;
  contentClassName?: string;
}

const NavBlockTitle = memo(({ title, onMoreClick }: { title: ReactNode; onMoreClick?: () => void }) => {
  return (
    <div className="flex items-center justify-between text-[36px] font-bold text-[var(--main-text-color)]">
      <div onClick={onMoreClick}>{title}</div>
      <div onClick={onMoreClick} className="py-[8px] pl-[20px]">
        <IconMore className="h-[29px] w-[14px]" />
      </div>
    </div>
  );
});

function NavBlock({ title, onMoreClick, className, contentClassName, children, ...rest }: NavBlockProps) {
  return (
    <div {...rest} className={clsx('my-[60px]', className)}>
      <NavBlockTitle title={title} onMoreClick={onMoreClick} />
      <div className={clsx('mt-[30px]', contentClassName)}>{children}</div>
    </div>
  );
}
export default memo(NavBlock);
