import type { ReactNode } from 'react';
import type { FallbackProps } from 'react-error-boundary';

export interface DefaultFallbackRenderProps extends FallbackProps {
  className?: string;
  style?: React.CSSProperties;
}

export function defaultFallbackRender(props: DefaultFallbackRenderProps): ReactNode {
  const { error, resetErrorBoundary, className, style } = props;

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
    ...(style || {}),
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
    <div role="alert" style={containerStyle} className={className}>
      <h2>Something went wrong</h2>
      <pre style={messageStyle}>{error.message}</pre>

      <button type="button" style={buttonStyle} onClick={resetErrorBoundary}>
        Retry
      </button>
    </div>
  );
}
