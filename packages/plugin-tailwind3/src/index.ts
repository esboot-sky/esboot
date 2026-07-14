import type { Plugin } from '@dz-web/esboot-common/plugin';
import { PluginHooks } from '@dz-web/esboot-common/plugin';
import { prepareTailwind3, tailwind3Config } from './prepare';

export interface PluginTailwind3Options {
  tailwindcssOptions?: Record<string, any> | ((config: any) => Record<string, any>);
}

export default function pluginTailwind3(
  options?: PluginTailwind3Options | ((config: any) => Record<string, any>),
): Plugin {
  return {
    name: 'plugin-tailwind3',
    enforce: 'pre',
    [PluginHooks.modifyConfig]: () => ({
      css: {
        tailwind: {
          enable: true,
          version: '3',
          separateImports: false,
        },
      },
    }) as any,
    [PluginHooks.prepare]: (cfg) => prepareTailwind3(cfg, options),
  };
}

export { tailwind3Config };

