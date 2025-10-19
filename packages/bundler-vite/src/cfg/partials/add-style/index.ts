import type { Plugin } from 'vite';

import type { AddFunc } from '@/cfg/types';
import reactStyleName from '@/plugins/react-style-name';

export const addStyle: AddFunc = async (_, viteCfg) => {
  viteCfg.plugins!.push(reactStyleName() as Plugin[]);
  viteCfg.css!.modules = {
    generateScopedName: '[name]__[local]___[hash:base64:5]',
    hashPrefix: 'prefix',
    globalModulePaths: [/styles/],
    scopeBehaviour: 'local',
    exportGlobals: true,
  };
};
