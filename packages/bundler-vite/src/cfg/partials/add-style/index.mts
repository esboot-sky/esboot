import reactStyleNamePlugin from '@/plugins/react-style-name/index.mts';

import type { Plugin } from 'vite';
import type { AddFunc } from '@/cfg/types.mts';

export const addStyle: AddFunc = async (cfg, viteCfg) => {
  const { rootPath, isSP } = cfg.config;
  viteCfg.plugins!.push(reactStyleNamePlugin({ rootPath, isSP }) as Plugin[]);
  const { localsConvention } = cfg.config.css?.modules || {};
  let viteLocalsConvention: any = localsConvention;

  if (localsConvention === 'asIs') {
    viteLocalsConvention = undefined;
  }

  viteCfg.css!.modules = {
    generateScopedName: '[name]__[local]___[hash:base64:5]',
    hashPrefix: 'prefix',
    globalModulePaths: [/styles/],
    scopeBehaviour: 'local',
    exportGlobals: true,
    ...(viteLocalsConvention ? { localsConvention: viteLocalsConvention } : {}),
  };
};
