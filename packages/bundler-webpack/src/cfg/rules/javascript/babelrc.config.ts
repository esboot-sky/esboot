import path from 'node:path';
import { fileURLToPath } from "node:url";
import type { Configuration, ConfigurationInstance } from '@dz-web/esboot';
import { addReactCompiler } from '@dz-web/esboot-bundler-common';
import { generateScopedNameFactory } from '@dz-web/babel-plugin-react-css-modules/utils';
import { getCssHashRule } from '../style/utils';

const resolvePath = (p: string) => fileURLToPath(import.meta.resolve(p));
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

export const getPlugins = (cfg: ConfigurationInstance, alias: Configuration['alias'], legacy: boolean) => {
  const customAlias: Configuration['alias'] = {};

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
            getCssHashRule()
          ),
        webpackHotModuleReloading: true,
        autoResolveMultipleImports: true,
        handleMissingStyleName: legacy ? 'warn' : 'throw',
      },
    ],
  ].filter(Boolean);
};

export const env = {
  production: {
    plugins: [],
  },
};
