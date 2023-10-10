import path from 'path';
import type { UserOpts } from '@@/config/types';

export const presets = [
  [
    require('@babel/preset-env'),
    {
      modules: false,
      useBuiltIns: 'usage',
      corejs: { version: 3, proposals: true },
    },
  ],
  [
    require('@babel/preset-react'),
    {
      runtime: 'automatic',
    },
  ],
];

export const getPlugins = (alias: UserOpts['alias']) => {
  const customAlias: UserOpts['alias'] = {};

  for (let k in alias) {
    const value = path.resolve(process.cwd(), `./${alias[k]}/`);

    customAlias[k] = value;
  }

  return [
    [require('@babel/plugin-syntax-dynamic-import')],
    [
      require('@dz-web/babel-plugin-react-css-modules'),
      {
        filetypes: {
          '.scss': {
            syntax: 'postcss-scss',
          },
        },
        generateScopedName:
          require('@dz-web/babel-plugin-react-css-modules/utils').generateScopedNameFactory(
            '[name]__[local]__[contenthash:base64:5]'
          ),
        webpackHotModuleReloading: true,
        autoResolveMultipleImports: true,
        handleMissingStyleName: 'throw',
      },
    ],
    [
      require.resolve('@jleonardvp/babel-plugin-module-resolver'),
      {
        alias: customAlias,
        extensions: ['.ts', '.tsx', '.json', '.svg'],
      },
    ],
  ];
};

export const env = {
  production: {
    plugins: ['transform-react-remove-prop-types'],
  },
};
