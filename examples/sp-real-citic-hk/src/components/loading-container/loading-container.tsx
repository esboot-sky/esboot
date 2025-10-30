import { SpinLoading } from 'antd-mobile';
import { forwardRef, Ref } from 'react';

import './loading-container.scss';

interface LoadingContainerProps {
  isLoading: boolean;
  children?: React.ReactNode;
  className?: string;
}

const LoadingContainer = forwardRef((props: LoadingContainerProps, ref: Ref<HTMLDivElement>) => {
  const { isLoading, children, className } = props;

  return (
    <div styleName="loading-x" className={className} ref={ref}>
      {isLoading && (
        <div styleName="loading-box">
          <SpinLoading />
        </div>
      )}

      {children}
    </div>
  );
});

export default LoadingContainer;
