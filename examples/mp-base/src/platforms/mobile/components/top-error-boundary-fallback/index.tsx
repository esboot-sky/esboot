import { FormattedMessage } from 'react-intl';

import './index.scss';

export function TopErrorBoundaryFallback({ error, resetErrorBoundary }) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <div styleName="error-boundary">
      <div styleName="error-message">
        <h2>
          <FormattedMessage id="global.boundaryErrorTitle" />
        </h2>
        <p>
          <FormattedMessage id="global.apologize" />
        </p>
        <p styleName="code-message">{error?.message}</p>
      </div>
      <button type="button" styleName="retry-button" onClick={resetErrorBoundary}>
        <FormattedMessage id="global.retry" />
      </button>
    </div>
  );
}
