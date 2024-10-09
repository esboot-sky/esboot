import { ProgressPlugin } from '@rspack/core';
import { info } from '@dz-web/esboot-common/helpers';
import readline from 'node:readline';

import type { AddFunc } from '@/cfg/types';

export const addProcessbarPlugin: AddFunc = async (cfg, rspackCfg) => {
  const { isCIBuild } = cfg.config;

  if (isCIBuild) return;

  let lastPercentage = 0;
  const startTime = Date.now();
  let progressBarVisible = false;

  const originalConsoleLog = console.log;
  console.log = (...args) => {
    if (progressBarVisible) {
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
    }
    originalConsoleLog(...args);
    if (progressBarVisible) {
      displayProgressBar(lastPercentage, lastMessage);
    }
  };

  let lastMessage = '';
  const displayProgressBar = (percent: number, message: string) => {
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`[${percent}%] ${message} `);
    progressBarVisible = true;
  };

  const handler = (percentage: number, message: string) => {
    const percent = Math.round(percentage * 100);

    if (percent !== lastPercentage || message !== lastMessage) {
      lastPercentage = percent;
      lastMessage = message;

      displayProgressBar(percent, message);

      if (percent === 100) {
        progressBarVisible = false;
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        info(`Used time: ${Date.now() - startTime}ms`);
        console.log = originalConsoleLog;
      }
    }
  };

  rspackCfg.plugins.push(new ProgressPlugin(handler));
};
