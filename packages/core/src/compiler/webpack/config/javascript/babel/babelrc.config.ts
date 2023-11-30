import path from 'path';
import type { UserOpts } from '@@/config/types';

// const cssHashRule =
//   process.env.NODE_ENV === 'production'
//     ? '[name]__[local]__[contenthash:base64:5]'
//     : '[package]___[path][name]___[local]___[hash:base64:6]';

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
      require.resolve('@jleonardvp/babel-plugin-module-resolver'),
      {
        alias: customAlias,
        extensions: ['.ts', '.tsx', '.json', '.svg'],
      },
    ],
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
  ];
};

export const env = {
  production: {
    plugins: ['transform-react-remove-prop-types'],
  },
};
