import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { defaultFallbackRender } from './default-fallback-render';

describe('defaultFallbackRender', () => {
  it('renders the error message and retry action', () => {
    const html = renderToStaticMarkup(defaultFallbackRender({
      error: new Error('boom'),
      resetErrorBoundary: vi.fn(),
    }));

    expect(html).toContain('Something went wrong');
    expect(html).toContain('boom');
    expect(html).toContain('Retry');
    expect(html).toContain('role="alert"');
  });

  it('merges className and custom styles into the container', () => {
    const html = renderToStaticMarkup(defaultFallbackRender({
      error: 'string error',
      resetErrorBoundary: vi.fn(),
      className: 'fallback-shell',
      style: {
        margin: 0,
      },
    }));

    expect(html).toContain('fallback-shell');
    expect(html).toContain('margin:0');
    expect(html).toContain('string error');
  });
});
