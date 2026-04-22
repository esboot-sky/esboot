import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PluginHooks } from '@dz-web/esboot-common/plugin';
import { describe, expect, it } from 'vitest';
import pluginTailwind3 from './index';

describe('plugin-tailwind3', () => {
  it('patches tailwindVersion to 3', () => {
    const plugin = pluginTailwind3();
    const patch = plugin[PluginHooks.modifyConfig]?.({} as any);

    expect(plugin.name).toBe('plugin-tailwind3');
    expect(patch).toEqual({
      css: {
        tailwind: {
          enable: true,
          version: '3',
          separateImports: false,
        },
      },
    });
  });

  it('ships tailwindcss as a package dependency', () => {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8')) as {
      dependencies?: Record<string, string>;
    };

    expect(packageJson.dependencies?.tailwindcss).toBe('^3.4.19');
  });
});
