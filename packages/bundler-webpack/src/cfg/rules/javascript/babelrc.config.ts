import type { Configuration, ConfigurationInstance } from '@dz-web/esboot';
import path from 'node:path';
import process from 'node:process';
import { generateScopedNameFactory } from '@dz-web/babel-plugin-react-css-modules/utils';
import { addReactCompiler } from '@dz-web/esboot-bundler-common';
import { createResolvePath } from '@dz-web/esboot-common/helpers';
import { getCssHashRule } from '../style/utils';

const resolvePath = createResolvePath(import.meta.resolve);
export const presets = [
  [
    resolvePath('@babel/preset-env'),
    {
      modules: false,
      useBuiltIns: 'usage',
      corejs: { version: 3, proposals: true },
    },
  ],
  [
    resolvePath('@babel/preset-react'),
    {
      runtime: 'automatic',
    },
  ],
];

export function getPlugins(cfg: ConfigurationInstance, alias: Configuration['alias'], legacy: boolean) {
  const customAlias: Configuration['alias'] = {};
  const { isDev } = cfg.config;

  for (const k in alias) {
    const value = path.resolve(process.cwd(), `./${alias[k]}/`);

    customAlias[k] = value;
  }

  return [
    addReactCompiler(cfg),
    [
      resolvePath('@jleonardvp/babel-plugin-module-resolver'),
      {
        alias: customAlias,
        extensions: ['.ts', '.tsx', '.json', '.svg'],
      },
    ],
    [
      resolvePath('@dz-web/babel-plugin-react-css-modules'),
      {
        filetypes: {
          '.scss': {
            syntax: 'postcss-scss',
          },
        },
        generateScopedName:
          generateScopedNameFactory(
            getCssHashRule(),
          ),
        webpackHotModuleReloading: true,
        autoResolveMultipleImports: true,
        handleMissingStyleName: legacy || !isDev ? 'warn' : 'throw',
      },
    ],
  ].filter(Boolean);
}

export const env = {
  production: {
    plugins: [],
  },
};
