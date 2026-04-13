import type { Plugin } from '@dz-web/esboot-common/plugin';
import { PluginHooks } from '@dz-web/esboot-common/plugin';
import { prepareTailwind3, tailwind3Config } from './prepare';

export default function pluginTailwind3(): Plugin {
  return {
    key: 'plugin-tailwind3',
    [PluginHooks.modifyConfig]: () => ({
      css: {
        tailwind: {
          enable: true,
          version: '3',
          separateImports: false,
        },
      },
    }) as any,
    [PluginHooks.prepare]: prepareTailwind3,
  };
}

export { tailwind3Config };
