import { ComponentProps } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export function withTopErrorBoundary(
  WrappedComponent: any,
  fallbackComponent: ComponentProps<typeof ErrorBoundary>['FallbackComponent'],
) {
  return function ErrorBoundaryApp(props) {
    return (
      <ErrorBoundary
        FallbackComponent={fallbackComponent!}
        onReset={(details) => {
          // Reset the state of your app so the error doesn't happen again
          console.warn('reset from top error boundary:', details);
        }}
      >
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}

export function wrapTopErrorBoundary(
  WrappedComponent: any,
  fallbackComponent: ComponentProps<typeof ErrorBoundary>['FallbackComponent'],
) {
  const ErrorBoundaryApp = withTopErrorBoundary(() => WrappedComponent, fallbackComponent);

  return <ErrorBoundaryApp />;
}
