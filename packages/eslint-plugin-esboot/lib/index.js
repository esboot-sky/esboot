import noCrossPlatformImports from './rules/no-cross-platform-imports.js';
import noCrossPlatformLibImports from './rules/no-cross-platform-lib-imports.js';
import pkg from '../package.json' with { type: 'json' };

const plugin = {
  meta: {
    name: pkg.name,
    version: pkg.version,
    namespace: 'esboot',
  },
  rules: {
    'no-cross-platform-imports': noCrossPlatformImports,
    'no-cross-platform-lib-imports': noCrossPlatformLibImports,
  },
  configs: {},
};

// Assign configs here so we can reference `plugin`
Object.assign(plugin.configs, {
  recommended: {
    plugins: {
      '@dz-web/esboot': plugin,
    },
    rules: {
      '@dz-web/esboot/no-cross-platform-imports': 'error',
    },
  },
  // Legacy config for backwards compatibility
  'recommended-legacy': {
    plugins: ['@dz-web/esboot'],
    rules: {
      '@dz-web/esboot/no-cross-platform-imports': 'error',
    },
  },
});

export default plugin;
