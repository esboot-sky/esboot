import type { ReactElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { createRoot, hydrateRoot, render } = vi.hoisted(() => ({
  createRoot: vi.fn(() => ({
    render,
  })),
  hydrateRoot: vi.fn(),
  render: vi.fn(),
}));

vi.mock('react-dom/client', () => ({
  createRoot,
  hydrateRoot,
}));

describe('mountReactApp', () => {
  const container = {} as Element;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('document', {
      getElementById: vi.fn(() => container),
    });
  });

  it('hydrates prerendered markup when hydrate is enabled', async () => {
    const { mountReactApp } = await import('./mount');

    mountReactApp(<div>docs</div> as ReactElement, { hydrate: true });

    expect(hydrateRoot).toHaveBeenCalledWith(
      container,
      expect.anything(),
    );
    expect(createRoot).not.toHaveBeenCalled();
  });

  it('creates a fresh root when hydrate is disabled', async () => {
    const { mountReactApp } = await import('./mount');

    mountReactApp(<div>docs</div> as ReactElement);

    expect(createRoot).toHaveBeenCalledWith(container);
    expect(render).toHaveBeenCalledWith(expect.anything());
    expect(hydrateRoot).not.toHaveBeenCalled();
  });
});
