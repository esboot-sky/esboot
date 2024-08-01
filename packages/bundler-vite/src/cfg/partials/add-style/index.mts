import type { AddFunc } from '../../types.mts';

export const addStyle: AddFunc = async function (_, viteCfg) {
  console.log(24334232, '<-- 24334232');
  viteCfg.css = {
    modules: {
      // globalModulePaths: [/styles/],
      generateScopedName: '[local]__[contenthash:base64:8]',
      // localsConvention: (...args: any) => {
      //   console.log(args, '<-- args');
      //   return args[1];
      // },
    },
  };
};
