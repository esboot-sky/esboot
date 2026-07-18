import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import createConfig from './eslint';

const originalProjectService = process.env.ESBOOT_ESLINT_PROJECT_SERVICE;

describe('createConfig', () => {
  beforeEach(() => {
    delete process.env.ESBOOT_ESLINT_PROJECT_SERVICE;
  });

  afterEach(() => {
    if (originalProjectService === undefined) {
      delete process.env.ESBOOT_ESLINT_PROJECT_SERVICE;
    }
    else {
      process.env.ESBOOT_ESLINT_PROJECT_SERVICE = originalProjectService;
    }
  });

  it('enables the TypeScript project service by default for consuming projects', async () => {
    const config = await createConfig();
    const reactConfig = config.find((item) => {
      const files = Array.isArray(item.files) ? item.files : [];
      return files.includes('**/*.{jsx,ts,tsx}');
    });
    const parserOptions = reactConfig?.languageOptions?.parserOptions as Record<string, unknown> | undefined;

    expect(parserOptions).toMatchObject({
      projectService: true,
      tsconfigRootDir: process.cwd(),
    });
  });

  it('disables the TypeScript project service when explicitly requested', async () => {
    process.env.ESBOOT_ESLINT_PROJECT_SERVICE = '0';

    const config = await createConfig();
    const reactConfig = config.find((item) => {
      const files = Array.isArray(item.files) ? item.files : [];
      return files.includes('**/*.{jsx,ts,tsx}');
    });
    const parserOptions = reactConfig?.languageOptions?.parserOptions as Record<string, unknown> | undefined;

    expect(parserOptions).not.toHaveProperty('projectService');
    expect(parserOptions).not.toHaveProperty('tsconfigRootDir');
  });

  it('keeps the environment override authoritative over custom React parser options', async () => {
    process.env.ESBOOT_ESLINT_PROJECT_SERVICE = '0';

    const config = await createConfig({
      reactConfig: {
        languageOptions: {
          parserOptions: {
            projectService: true,
            tsconfigRootDir: '/custom/project',
          },
        },
      },
    });
    const reactConfig = config.find((item) => {
      const files = Array.isArray(item.files) ? item.files : [];
      return files.includes('**/*.{jsx,ts,tsx}');
    });
    const parserOptions = reactConfig?.languageOptions?.parserOptions as Record<string, unknown> | undefined;

    expect(parserOptions).not.toHaveProperty('projectService');
    expect(parserOptions).not.toHaveProperty('tsconfigRootDir');
  });

  it('enables the TypeScript project service when explicitly requested', async () => {
    process.env.ESBOOT_ESLINT_PROJECT_SERVICE = '1';

    const config = await createConfig();
    const reactConfig = config.find((item) => {
      const files = Array.isArray(item.files) ? item.files : [];
      return files.includes('**/*.{jsx,ts,tsx}');
    });
    const parserOptions = reactConfig?.languageOptions?.parserOptions as Record<string, unknown> | undefined;

    expect(parserOptions).toMatchObject({
      projectService: true,
      tsconfigRootDir: process.cwd(),
    });
  });

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
