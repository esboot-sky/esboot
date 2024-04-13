const { resolve } = require('path');

module.exports = {
  themeConfig: {
    name: 'ESBoot',
    logo: './images/dz-logo.jpg',
  },
  history: {
    type: 'hash',
  },
  publicPath: '/',
  // mfsu: {
  //   development: {
  //     output: './.mfsu-dev',
  //   },
  //   // production : {
  //   //   output : "./.mfsu-prod",
  //   // }
  // },
  mfsu: false,
  alias: {
    '@src': resolve(process.cwd(), './src'),
  },
  favicons: ['./images/dz-logo.jpg'],
};
