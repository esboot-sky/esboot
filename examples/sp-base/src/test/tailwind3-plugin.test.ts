// @vitest-environment node
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PluginHooks } from '@dz-web/esboot-common/plugin';
import { describe, expect, it } from 'vitest';
import config from '../../esbootrc/vite.ts';

describe('sp-base tailwind3 wiring', () => {
  it('includes the tailwind3 plugin and patches config', () => {
    const tailwind3 = config.plugins?.find(plugin => plugin.key === 'plugin-tailwind3');

    expect(tailwind3).toBeDefined();
    expect(tailwind3?.[PluginHooks.modifyConfig]?.({} as any)).toEqual({
      css: {
        tailwind: {
          enable: true,
          version: '3',
          separateImports: false,
        },
      },
    });
  });

  it('does not declare tailwindcss directly in the example package', () => {
    const packageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8')) as {
      devDependencies?: Record<string, string>;
    };

    expect(packageJson.devDependencies?.tailwindcss).toBeUndefined();
  });
});
