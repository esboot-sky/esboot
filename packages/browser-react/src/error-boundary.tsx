import type { ErrorInfo, ReactNode } from 'react';
import type { ErrorBoundaryProps, FallbackProps } from 'react-error-boundary';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

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

function defaultFallbackRender(props: FallbackProps): ReactNode {
  const { error, resetErrorBoundary } = props;
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  // Inline styles (kept concise for maintainability)
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 600,
    margin: '10% auto',
    padding: '40px 16px',
    border: '1px solid #e0e0e0',
    borderRadius: 8,
    background: '#fafafa',
    textAlign: 'center',
    color: '#000',
  };

  const messageStyle: React.CSSProperties = {
    color: '#d32f2f',
    fontWeight: 500,
    margin: '16px 0',
    whiteSpace: 'pre-wrap',
  };

  const buttonStyle: React.CSSProperties = {
    background: '#1976d2',
    color: '#fff',
    padding: '8px 24px',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    marginTop: 24,
  };

  return (
    <div role="alert" style={containerStyle}>
      <h2>Something went wrong</h2>
      <pre style={messageStyle}>{error.message}</pre>

      <button type="button" style={buttonStyle} onClick={resetErrorBoundary}>
        Retry
      </button>
    </div>
  );
}

function ErrorBoundary(props: ErrorBoundaryPropsByESBoot): ReactNode {
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
      {/* @ts-expect-error ReactErrorBoundary children typing */}
      {children}
    </ReactErrorBoundary>
  );
}

export { ErrorBoundary };
