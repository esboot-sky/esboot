import { isArray, isObject } from '@dz-web/esboot-common/lodash';

export function matchPlugin(plugins: any[], names: string[]) {
  const path = '';

  plugins.forEach((pluginItem) => {
    if (isArray(pluginItem)) {
      matchPlugin(pluginItem, names);
    }
    else if (isObject(pluginItem)) {
      if (pluginItem.name && names.includes(pluginItem.name)) {
        return pluginItem;
      }
    }
  });
}
