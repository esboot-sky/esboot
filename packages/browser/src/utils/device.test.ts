import { afterEach, describe, expect, it, vi } from 'vitest';

describe('device helpers', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it('detects iOS user agents', async () => {
    vi.stubGlobal('navigator', {
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
    });

    const device = await import('./device');

    expect(device.userAgent).toContain('iPhone');
    expect(device.isIOS).toBe(true);
    expect(device.isAndroid).toBe(false);
  });

  it('detects Android user agents', async () => {
    vi.stubGlobal('navigator', {
      userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8)',
    });

    const device = await import('./device');

    expect(device.isIOS).toBe(false);
    expect(device.isAndroid).toBe(true);
  });
});
