import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const ReactErrorBoundary = vi.fn(({ children, fallbackRender, onError, onReset }: any) => {
  onError?.(new Error('boom'), { componentStack: 'stack' });
  onReset?.({ reason: 'imperative-api', args: [] });
  return fallbackRender
    ? fallbackRender({
        error: new Error('boom'),
        resetErrorBoundary: vi.fn(),
      })
    : children;
});

vi.mock('react-error-boundary', async () => {
  const actual = await vi.importActual<object>('react-error-boundary');
  return {
    ...actual,
    ErrorBoundary: ReactErrorBoundary,
  };
});

describe('ErrorBoundary component', () => {
  it('forwards onError/onReset and uses fallback render', async () => {
    const onError = vi.fn();
    const onReset = vi.fn();
    const fallbackRender = vi.fn(() => <div>fallback</div>);
    const { ErrorBoundary } = await import('./error-boundary');

    const html = renderToStaticMarkup(
      <ErrorBoundary onError={onError} onReset={onReset} fallbackRender={fallbackRender}>
        <div>child</div>
      </ErrorBoundary>,
    );

    expect(ReactErrorBoundary).toHaveBeenCalled();
    expect(onError).toHaveBeenCalled();
    expect(onReset).toHaveBeenCalledWith({ reason: 'imperative-api', args: [] });
    expect(fallbackRender).toHaveBeenCalled();
    expect(html).toContain('fallback');
  });
});
