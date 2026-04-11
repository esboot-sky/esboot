import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('react-scan', () => ({
  scan: vi.fn(),
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe('monitorPerformance', () => {
  it('enables react-scan with default options', async () => {
    const reactScan = await import('react-scan');
    const { monitorPerformance } = await import('./performance');

    await monitorPerformance();

    expect(reactScan.scan).toHaveBeenCalledWith({
      enabled: true,
      showToolbar: true,
      showFPS: true,
    });
  });

  it('skips react-scan when disabled', async () => {
    const reactScan = await import('react-scan');
    const { monitorPerformance } = await import('./performance');

    await monitorPerformance({ enabledReactScan: false });

    expect(reactScan.scan).not.toHaveBeenCalled();
  });
});
