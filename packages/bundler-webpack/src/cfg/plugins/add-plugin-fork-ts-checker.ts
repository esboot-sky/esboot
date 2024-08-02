// Temporarily disabled due to insufficient usage.
//
//
// // import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

// import type { AddFunc } from '@/cfg/types';

// export const addForkTsCheckerWebpackPlugin: AddFunc = async function (cfg, webpackCfg) {
//   const { isDev, TSChecker } = cfg.config;

//   if (isDev && TSChecker) {
//     webpackCfg.plugins.push(
//       new ForkTsCheckerWebpackPlugin({
//         // typescript: {
//         //   typescriptPath: searchCommand('typescript'),
//         // },
//       })
//     );
//   }
// };
