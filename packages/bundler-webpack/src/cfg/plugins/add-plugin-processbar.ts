import type { AddFunc } from '@/cfg/types';
import process from 'node:process';
import readline from 'node:readline';
import { info } from '@dz-web/esboot-common/helpers';

import { ProgressPlugin } from 'webpack';

export const addProcessbarPlugin: AddFunc = async (cfg, webpackCfg) => {
  const { isCIBuild } = cfg.config;

  if (isCIBuild)
    return;

  let lastPercentage = 0;
  let startTime = Date.now();
  let progressBarVisible = false;
  let timeDisplayed = false;

  let lastMessage = '';
  const displayProgressBar = (percent: number, message: string): void => {
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`[${percent}%] ${message} `);
    progressBarVisible = true;
  };

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

  const handler = (percentage: number, message: string) => {
    const percent = Math.round(percentage * 100);
    if (message === 'cache')
      return;

    if (lastPercentage === 0 && !timeDisplayed) {
      startTime = Date.now();
    }

    if (percent !== lastPercentage || message !== lastMessage) {
      displayProgressBar(percent, message);

      if (percent === 100 && !timeDisplayed) {
        progressBarVisible = false;
        timeDisplayed = true;

        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        info(`Used time: ${Date.now() - startTime}ms`);

        console.log = originalConsoleLog;
      }

      lastPercentage = percent;
      lastMessage = message;
    }
  };

  webpackCfg.plugins.push(new ProgressPlugin(handler));
};
