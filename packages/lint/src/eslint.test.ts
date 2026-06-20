import { describe, expect, it } from 'vitest';

import createConfig from './eslint';

describe('createConfig', () => {
  it('uses the Tailwind 4 rule names and keeps new recommended rules enabled', async () => {
    const config = await createConfig();
    const reactConfig = config.find(item => {
      const files = Array.isArray(item.files) ? item.files : [];
      return files.includes('**/*.{jsx,ts,tsx}');
    });

    expect(reactConfig).toBeDefined();

    const rules = reactConfig?.rules as Record<string, unknown>;

    expect(rules['better-tailwindcss/no-unregistered-classes']).toBe('off');
    expect(rules['better-tailwindcss/no-unknown-classes']).toBe('off');
    expect(rules['better-tailwindcss/enforce-canonical-classes']).toBeDefined();
    expect(rules['better-tailwindcss/enforce-consistent-variant-order']).toBeDefined();
    expect(rules['better-tailwindcss/enforce-logical-properties']).toBeDefined();
  });
});
