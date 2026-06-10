import type { Configuration } from '@dz-web/esboot';
import type { InlineConfig } from 'vite';

export interface PluginVitestOptions {
  customConfig?: (
    config: InlineConfig,
    cfg: Configuration,
  ) => InlineConfig | Promise<InlineConfig>;
}

export const VITEST_PLUGIN_OPTIONS_FIELD = '__esbootPluginVitestOptions';

export function getPluginVitestOptions(plugins: unknown[] = []): PluginVitestOptions {
  for (const plugin of plugins) {
    if (!plugin || typeof plugin !== 'object') {
      continue;
    }

    const candidate = plugin as Record<string, unknown>;
    if (candidate.name === 'plugin-vitest' && candidate[VITEST_PLUGIN_OPTIONS_FIELD]) {
      return candidate[VITEST_PLUGIN_OPTIONS_FIELD] as PluginVitestOptions;
    }
  }

  return {};
}
