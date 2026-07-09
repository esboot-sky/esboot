import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import createConfig from './eslint';

describe('createConfig', () => {
  it('uses the Tailwind 4 rule names and keeps new recommended rules enabled', async () => {
    const config = await createConfig();
    const reactConfig = config.find((item) => {
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

  it('keeps React display-name checks enabled while avoiding a direct eslint-plugin-react dependency', async () => {
    const config = await createConfig();
    const reactConfig = config.find((item) => {
      const files = Array.isArray(item.files) ? item.files : [];
      return files.includes('**/*.{jsx,ts,tsx}');
    });

    expect(reactConfig).toBeDefined();

    const rules = reactConfig?.rules as Record<string, unknown>;

    expect(rules['react/no-missing-context-display-name']).toBe('error');
    expect(rules['react/no-missing-component-display-name']).toBe('error');
  });

  it('disables style/max-len for json, jsonc, and json5 files', async () => {
    const config = await createConfig();
    const maxLenOffConfigs = config.filter((item) => {
      const files = Array.isArray(item.files) ? item.files : (item.files ? [item.files] : []);
      const matchesJson = files.some(file => file.includes('*.json') || file.includes('**/*.json'));
      const rules = (item.rules as Record<string, unknown>) || {};
      return matchesJson && rules['style/max-len'] === 'off';
    });

    expect(maxLenOffConfigs.length).toBeGreaterThan(0);
  });
});

describe('package manifest', () => {
  it('does not expose unnecessary lint peers to esboot consumers', () => {
    const packageJson = JSON.parse(
      readFileSync(join(process.cwd(), 'packages/lint/package.json'), 'utf8'),
    ) as {
      peerDependencies?: Record<string, string>;
      dependencies?: Record<string, string>;
    };

    expect(packageJson.peerDependencies?.stylelint).toBeUndefined();
    expect(packageJson.dependencies?.stylelint).toBeDefined();
    expect(packageJson.dependencies?.['eslint-plugin-react']).toBeUndefined();
  });
});
