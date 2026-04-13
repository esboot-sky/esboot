import type { Plugin } from '@dz-web/esboot-common/plugin';
import { PluginHooks } from '@dz-web/esboot-common/plugin';

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
  };
}
