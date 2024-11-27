import WebpackBar from 'webpackbar';

import type { AddFunc } from '@/cfg/types';

// @deprecated
export const addWebpackbarPlugin: AddFunc = async (cfg, webpackCfg) => {
  const { analyze, isCIBuild } = cfg.config;

  if (isCIBuild) return;

  webpackCfg.plugins.push(
    new WebpackBar({
      name: 'ESBoot',
      color: 'magenta',
      fancy: true,
      basic: true,
      profile: analyze,
      reporters: [
        'fancy',
        analyze && 'profile',
      ].filter(Boolean) as any[],
    })
  );
};
