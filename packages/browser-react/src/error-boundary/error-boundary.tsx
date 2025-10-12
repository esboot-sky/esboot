import type { ErrorInfo, ReactNode } from 'react';
import type { ErrorBoundaryProps, FallbackProps } from 'react-error-boundary';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { defaultFallbackRender } from './default-fallback-render';

/**
 * Copy from react-error-boundary
 */
interface ErrorBoundarySharedProps {
  onError?: (error: Error, info: ErrorInfo) => void;
  onReset?: (details: {
    reason: 'imperative-api';
    args: any[];
  } | {
    reason: 'keys';
    prev: any[] | undefined;
    next: any[] | undefined;
  }) => void;
  resetKeys?: any[];
}

interface ErrorBoundaryPropsByESBoot extends ErrorBoundarySharedProps {
  fallbackRender?: (props: FallbackProps) => ReactNode;
  children: ReactNode;
}

function ErrorBoundary(props: ErrorBoundaryPropsByESBoot) {
  const { children, fallbackRender = defaultFallbackRender } = props;

  const logError = (error: Error, info: ErrorInfo): void => {
    console.error('error1:', error);
    console.error('info1:', info);
    // Do something with the error, e.g. log to an external API
  };

  const onReset = (
    details:
      | { reason: 'imperative-api'; args: any[] }
      | { reason: 'keys'; prev: any[] | undefined; next: any[] | undefined },
  ): void => {
    // Reset the state of your app so the error doesn't happen again
    console.warn('reset from top error boundary:', details);
  };

  return (
    <ReactErrorBoundary
      onReset={onReset}
      onError={logError}
      fallbackRender={fallbackRender as ErrorBoundaryProps['fallbackRender']}
    >
      {children}
    </ReactErrorBoundary>
  );
}

export { ErrorBoundary };
