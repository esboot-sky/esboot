import path from 'node:path';
import type { Configuration } from '@dz-web/esboot';
import { fileURLToPath } from "node:url";
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

export const getPlugins = (alias: Configuration['alias'], legacy: boolean) => {
  const customAlias: Configuration['alias'] = {};

  for (const k in alias) {
    const value = path.resolve(process.cwd(), `./${alias[k]}/`);

    customAlias[k] = value;
  }

  return [
    [
      resolvePath('babel-plugin-react-compiler'),
      {
        target: '19',
      },
    ],
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
  ];
};

export const env = {
  production: {
    plugins: [],
  },
};
