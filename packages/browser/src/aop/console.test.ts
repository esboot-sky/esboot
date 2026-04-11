import { afterEach, describe, expect, it, vi } from 'vitest';

import { createExternalConsole } from './console';

interface MockScript {
  src: string;
  async: boolean;
  onload?: () => void;
  onerror?: () => void;
}

describe('createExternalConsole', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('returns false when disabled', async () => {
    vi.stubGlobal('window', {
      GLOBAL_CONFIG: {
        debug: false,
      },
    });

    await expect(createExternalConsole({ enabled: false })).resolves.toBe(false);
  });

  it('appends the script and resolves eruda.init on load', async () => {
    const script: MockScript = {
      src: '',
      async: false,
    };
    const appendChild = vi.fn((node: MockScript) => {
      node.onload?.();
    });
    const init = vi.fn();

    vi.stubGlobal('window', {
      GLOBAL_CONFIG: {
        debug: true,
      },
      eruda: {
        init,
      },
      document: {
        body: {
          appendChild,
        },
      },
    });
    vi.stubGlobal('document', {
      createElement: vi.fn(() => script),
    });

    await expect(createExternalConsole()).resolves.toBe(init);
    expect(script.src).toBe('https://cdn.jsdelivr.net/npm/eruda');
    expect(script.async).toBe(true);
    expect(appendChild).toHaveBeenCalledWith(script);
  });

  it('resolves false when the script fails to load', async () => {
    const script: MockScript = {
      src: '',
      async: false,
    };

    vi.stubGlobal('window', {
      GLOBAL_CONFIG: {
        debug: true,
      },
      document: {
        body: {
          appendChild: (node: MockScript) => {
            node.onerror?.();
          },
        },
      },
    });
    vi.stubGlobal('document', {
      createElement: vi.fn(() => script),
    });

    await expect(createExternalConsole()).resolves.toBe(false);
  });
});
