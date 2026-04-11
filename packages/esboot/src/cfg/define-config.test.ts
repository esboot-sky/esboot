import { describe, expect, it } from 'vitest';

import { defineConfig } from './define-config';

describe('defineConfig', () => {
  it('returns plain config objects unchanged', () => {
    const config = { isSP: true, alias: { '@': 'src' } };

    expect(defineConfig(config)).toBe(config);
  });

  it('returns config factories unchanged', () => {
    const factory = (cfg: Record<string, unknown>) => ({
      cwd: cfg.cwd,
    });

    expect(defineConfig(factory)).toBe(factory);
  });
});
