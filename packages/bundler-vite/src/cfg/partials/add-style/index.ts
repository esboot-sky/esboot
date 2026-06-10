import type { AddFunc } from '@/cfg/types';
import { reactStyleNamePlugin } from '@dz-web/esboot-bundler-common';

const STYLE_GLOBAL_PATH_RE = /styles/;

export const addStyle: AddFunc = async (cfg, viteCfg) => {
  const { rootPath, isSP } = cfg.config;
  const { localsConvention, useStyleName } = cfg.config.css?.modules || {};

  viteCfg.plugins!.push(...reactStyleNamePlugin({ rootPath, isSP, useStyleName }));
  let viteLocalsConvention: any = localsConvention;

  if (localsConvention === 'asIs') {
    viteLocalsConvention = undefined;
  }
  viteCfg.css!.modules = {
    generateScopedName: '[name]__[local]___[hash:base64:5]',
    hashPrefix: 'prefix',
    globalModulePaths: [STYLE_GLOBAL_PATH_RE],
    scopeBehaviour: 'local',
    exportGlobals: true,
    ...(viteLocalsConvention ? { localsConvention: viteLocalsConvention } : {}),
  };
};
