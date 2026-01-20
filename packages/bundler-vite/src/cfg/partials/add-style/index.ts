import type { Plugin } from 'vite';

import type { AddFunc } from '@/cfg/types';
import reactStyleName from '@/plugins/react-style-name';

export const addStyle: AddFunc = async (cfg, viteCfg) => {
  const { rootPath, isSP } = cfg.config;
  viteCfg.plugins!.push(reactStyleName({ rootPath, isSP }) as Plugin[]);
  viteCfg.css!.modules = {
    generateScopedName: '[name]__[local]___[hash:base64:5]',
    hashPrefix: 'prefix',
    globalModulePaths: [/styles/],
    scopeBehaviour: 'local',
    exportGlobals: true,
  };
};
