import { ErrorBoundary } from '@dz-web/esboot-browser-react';

export function withTopErrorBoundary(
  WrappedComponent: any,
) {
  return function ErrorBoundaryApp(props) {
    return (
      <ErrorBoundary>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}

export function wrapTopErrorBoundary(
  WrappedComponent: any,
) {
  const ErrorBoundaryApp = withTopErrorBoundary(() => WrappedComponent);

  return <ErrorBoundaryApp />;
}
