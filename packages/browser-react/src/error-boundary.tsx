import { type PropsWithChildren } from "react";
import { ErrorBoundary as ReactErrorBoundary, type ErrorBoundaryPropsWithRender } from 'react-error-boundary';

function fallbackRender({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void; }) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>

      <button onClick={resetErrorBoundary}>Retry</button>
    </div>
  );
}

interface ErrorBoundaryPropsByESBoot extends PropsWithChildren<ErrorBoundaryPropsWithRender> {
  test: number;
}

const ErrorBoundary = (props: ErrorBoundaryPropsByESBoot) => {
  const { children } = props;

  return (
    <ReactErrorBoundary
      onReset={(details) => {
        // Reset the state of your app so the error doesn't happen again
        console.warn('reset from top error boundary:', details);
      }}
      fallbackRender={fallbackRender}
    >
      {children}
    </ReactErrorBoundary>
  );
};

export { useErrorBoundary, withErrorBoundary } from 'react-error-boundary';
export { ErrorBoundary };