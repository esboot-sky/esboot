import path from 'node:path';
import type { Configuration } from '@dz-web/esboot';
import { getCssHashRule } from '../style/utils';

export const presets = [
  [
    require.resolve('@babel/preset-env'),
    {
      modules: false,
      useBuiltIns: 'usage',
      corejs: { version: 3, proposals: true },
    },
  ],
  [
    require.resolve('@babel/preset-react'),
    {
      runtime: 'automatic',
    },
  ],
];

export const getPlugins = (alias: Configuration['alias']) => {
  const customAlias: Configuration['alias'] = {};

  for (const k in alias) {
    const value = path.resolve(process.cwd(), `./${alias[k]}/`);

    customAlias[k] = value;
  }

  return [
    [
      require.resolve('@jleonardvp/babel-plugin-module-resolver'),
      {
        alias: customAlias,
        extensions: ['.ts', '.tsx', '.json', '.svg'],
      },
    ],
    [
      require.resolve('@dz-web/babel-plugin-react-css-modules'),
      {
        filetypes: {
          '.scss': {
            syntax: 'postcss-scss',
          },
        },
        generateScopedName:
          require('@dz-web/babel-plugin-react-css-modules/utils').generateScopedNameFactory(
            getCssHashRule()
          ),
        webpackHotModuleReloading: true,
        autoResolveMultipleImports: true,
        handleMissingStyleName: 'throw',
      },
    ],
  ];
};

export const env = {
  production: {
    plugins: [],
  },
};
