import type { Plugin } from 'vite';

import type { AddFunc } from '@/cfg/types';
import reactStyleName from '@/plugins/react-style-name';

export const addStyle: AddFunc = async (cfg, viteCfg) => {
  const { rootPath, isSP } = cfg.config;
  const { localsConvention, useStyleName } = cfg.config.css?.modules || {};
  viteCfg.plugins!.push(reactStyleName({ rootPath, isSP, useStyleName }) as Plugin[]);
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
