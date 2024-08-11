import type { Plugin } from 'vite';
import type { AddFunc } from '../../types.mts';
import reactStyleName from '../../../plugins/react-style-name/index.mts';

export const addStyle: AddFunc = async function (_, viteCfg) {
  viteCfg.plugins!.push(reactStyleName() as Plugin[]);
  viteCfg.css!.modules = {
    generateScopedName: '[name]__[local]___[hash:base64:5]',
    hashPrefix: 'prefix',
    globalModulePaths: [/styles/],
    scopeBehaviour: 'local',
    exportGlobals: true,
  };
};
