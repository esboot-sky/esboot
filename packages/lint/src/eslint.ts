import process from 'node:process';

import antfu from '@antfu/eslint-config';
import { shellEnv } from '@dz-web/esboot-common/environment';
import { merge } from '@dz-web/esboot-common/lodash';
// @ts-expect-error - esbootPlugin may not have type definitions
import esbootPlugin from '@dz-web/eslint-plugin-esboot';
import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss';
import reactHooks from 'eslint-plugin-react-hooks';

import esbootJsoncPlugin from './plugins/esboot-jsonc';

const betterTailwindcssRules = {
  ...eslintPluginBetterTailwindcss.configs['recommended-warn'].rules,
  ...eslintPluginBetterTailwindcss.configs['recommended-error'].rules,

  'better-tailwindcss/enforce-consistent-line-wrapping': [
    'warn',
    { printWidth: 100 },
  ],
  'better-tailwindcss/enforce-canonical-classes': 'warn',
  'better-tailwindcss/enforce-consistent-variant-order': 'warn',
  'better-tailwindcss/enforce-logical-properties': 'warn',
  // Keep both names disabled while upstream still exposes the legacy alias.
  'better-tailwindcss/no-unregistered-classes': 'off',
  'better-tailwindcss/no-unknown-classes': 'off',
} as any;

type Config = ReturnType<typeof antfu>;
type AntfuConfigItem = Parameters<typeof antfu>[number];

interface FlatConfigItem {
  files?: string | string[];
  plugins?: Record<string, unknown>;
  rules?: Record<string, unknown>;
  settings?: Record<string, unknown>;
  [key: string]: unknown;
}

interface Options {
  react?: boolean;
  vue?: boolean;
  base?: Parameters<typeof antfu>[0];
  // jsonc?: Partial<FlatConfigItem>;
  vueConfig?: Partial<FlatConfigItem>;
  reactConfig?: Partial<FlatConfigItem>;
  settings?: Record<string, unknown>;
  globalRules?: Record<string, unknown>;
  extends?: AntfuConfigItem[];
}

function buildBaseConfig(customBase?: Parameters<typeof antfu>[0], react = true, vue = false): Parameters<typeof antfu>[0] {
  const defaultBase: Parameters<typeof antfu>[0] = {
    vue,
    react,
    typescript: true,
    stylistic: {
      semi: true,
      quotes: 'single',
      indent: 2,
      overrides: {
        'style/max-len': ['error', { code: 120 }],
      },
    },
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/lib/**',
      '**/.cache/**',
      '**/coverage/**',
      '**/.nyc_output/**',
      '**/stats.html',
    ],
  };

  return customBase ? merge({}, defaultBase, customBase) : defaultBase;
}

function buildJsoncConfig(customJsonc?: Partial<FlatConfigItem>): AntfuConfigItem {
  const defaultConfig: FlatConfigItem = {
    files: ['**/lang/*.{json,jsonc}'],
    plugins: {
      'esboot-jsonc': esbootJsoncPlugin,
    },
    rules: {
      'jsonc/key-name-casing': ['error', {
        'camelCase': false,
        'PascalCase': false,
        'SCREAMING_SNAKE_CASE': false,
        'kebab-case': true,
        'snake_case': true,
        'ignores': [],
      }],
      'jsonc/no-useless-escape': 'off',
      'esboot-jsonc/no-chinese-key': 'error',
    },
  };

  if (!customJsonc) {
    return defaultConfig as AntfuConfigItem;
  }

  const merged: FlatConfigItem = { ...defaultConfig };

  if (customJsonc.files !== undefined) {
    merged.files = customJsonc.files;
  }

  if (customJsonc.plugins) {
    merged.plugins = merge({}, defaultConfig.plugins || {}, customJsonc.plugins) as Record<string, unknown>;
  }

  if (customJsonc.rules) {
    merged.rules = merge({}, defaultConfig.rules || {}, customJsonc.rules) as Record<string, unknown>;
  }

  return merge({}, merged, customJsonc) as AntfuConfigItem;
}

function buildVueConfig(customVue?: Partial<FlatConfigItem>): AntfuConfigItem {
  const defaultConfig: FlatConfigItem = {
    files: ['**/*.{vue}'],
    plugins: {
      'better-tailwindcss': eslintPluginBetterTailwindcss,
    },
    rules: {
      ...betterTailwindcssRules,
    },
  };

  if (!customVue) {
    return defaultConfig as AntfuConfigItem;
  }

  const merged: FlatConfigItem = { ...defaultConfig };

  if (customVue.files !== undefined) {
    merged.files = customVue.files;
  }

  if (customVue.plugins) {
    merged.plugins = merge({}, defaultConfig.plugins || {}, customVue.plugins) as Record<string, unknown>;
  }

  if (customVue.rules) {
    merged.rules = merge({}, defaultConfig.rules || {}, customVue.rules) as Record<string, unknown>;
  }

  return merge({}, merged, customVue) as AntfuConfigItem;
}

function buildReactConfig(customReact?: Partial<FlatConfigItem>): AntfuConfigItem {
  const useProjectService = shellEnv.get(
    'ESBOOT_ESLINT_PROJECT_SERVICE',
    '1',
  ) === '1';
  const defaultConfig: FlatConfigItem = {
    files: ['**/*.{jsx,ts,tsx}'],
    languageOptions: {
      parserOptions: useProjectService
        ? {
            projectService: true,
            tsconfigRootDir: process.cwd(),
          }
        : {},
    },
    plugins: {
      'better-tailwindcss': eslintPluginBetterTailwindcss,
      '@dz-web/esboot': esbootPlugin,
    },
    rules: {
      ...esbootPlugin.configs.recommended.rules,
      ...reactHooks.configs['recommended-latest'].rules,
      ...betterTailwindcssRules,
      'react/no-missing-context-display-name': 'error',
      'react/no-missing-component-display-name': 'error',
    },
  };

  if (!customReact) {
    return defaultConfig as AntfuConfigItem;
  }

  const merged: FlatConfigItem = { ...defaultConfig };

  if (customReact.files !== undefined) {
    merged.files = customReact.files;
  }

  if (customReact.plugins) {
    merged.plugins = merge({}, defaultConfig.plugins || {}, customReact.plugins) as Record<string, unknown>;
  }

  if (customReact.rules) {
    merged.rules = merge({}, defaultConfig.rules || {}, customReact.rules) as Record<string, unknown>;
  }

  const result = merge({}, merged, customReact) as FlatConfigItem;

  if (!useProjectService) {
    const languageOptions = result.languageOptions as { parserOptions?: Record<string, unknown> } | undefined;
    delete languageOptions?.parserOptions?.projectService;
    delete languageOptions?.parserOptions?.tsconfigRootDir;
  }

  return result as AntfuConfigItem;
}

function buildSettingsConfig(customSettings?: Record<string, unknown>): AntfuConfigItem {
  const defaultSettings = {
    'better-tailwindcss': {
      variables: ['.*cls'],
      entryPoint: 'src/styles/index.scss',
    },
  };

  return {
    settings: customSettings ? merge({}, defaultSettings, customSettings) : defaultSettings,
  } as AntfuConfigItem;
}

function buildGlobalRulesConfig(customGlobalRules?: Record<string, unknown>): AntfuConfigItem {
  const defaultRules: Record<string, unknown> = {
    'no-console': 'off',
    'antfu/if-newline': 'off',
    'style/if-newline': 'off',
  };

  return {
    rules: customGlobalRules ? merge({}, defaultRules, customGlobalRules) : defaultRules,
  } as AntfuConfigItem;
}

export default async function createConfig(options?: Options): Promise<Config> {
  const {
    react = true,
    vue = false,
    base,
    vueConfig,
    reactConfig,
    settings,
    globalRules,
    extends: extendsConfigs = [],
  } = options || {};

  const baseConfig = buildBaseConfig(base, react, vue);
  const jsoncConfig = buildJsoncConfig();
  const vueConfigItem = buildVueConfig(vueConfig);
  const reactConfigItem = buildReactConfig(reactConfig);
  const settingsConfig = buildSettingsConfig(settings);
  const globalRulesConfig = buildGlobalRulesConfig(globalRules);

  const srcConfig = {
    files: ['**/src/**/*.{js,jsx,ts,tsx,vue}'],
    rules: {
      'node/prefer-global/process': 'off',
    },
  };

  const config = antfu(
    baseConfig,
    jsoncConfig as any,
    vueConfigItem as any,
    reactConfigItem as any,
    srcConfig as any,
    settingsConfig as any,
    globalRulesConfig as any,
    {
      files: ['**/*.json', '**/*.jsonc', '**/*.json5'],
      rules: {
        'style/max-len': 'off',
      },
    } as any,
    ...extendsConfigs.filter((item): item is any => item !== undefined),
  );

  return config;
}
