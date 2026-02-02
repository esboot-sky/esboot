import type { ErrorInfo, PropsWithChildren, ReactNode } from 'react';
import type { FallbackProps } from 'react-error-boundary';
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
}

interface ErrorBoundaryPropsByESBoot extends ErrorBoundarySharedProps, PropsWithChildren {
  fallbackRender?: (props: FallbackProps) => ReactNode;
}

function ErrorBoundary(props: ErrorBoundaryPropsByESBoot): ReactNode {
  const { children, fallbackRender = defaultFallbackRender } = props;

  const logError = (error: Error, info: ErrorInfo): void => {
    props.onError?.(error, info);
    // Do something with the error, e.g. log to an external API
  };

  const onReset = (
    details:
      | { reason: 'imperative-api'; args: any[] }
      | { reason: 'keys'; prev: any[] | undefined; next: any[] | undefined },
  ): void => {
    // Reset the state of your app so the error doesn't happen again
    // console.warn('reset from top error boundary:', details);
    props.onReset?.(details);
  };

  return (
    <ReactErrorBoundary
      onReset={onReset}
      onError={logError}
      fallbackRender={fallbackRender}
    >
      {/* @ts-ignore */}
      {children}
    </ReactErrorBoundary>
  );
}

export { ErrorBoundary };
