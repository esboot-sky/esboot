import webpack from 'webpack';
import { info } from '@dz-web/esboot-common/helpers';
import readline from 'node:readline';

import type { AddFunc } from '@/cfg/types';

export const addProcessbarPlugin: AddFunc = async (cfg, rspackCfg) => {
  const { isCIBuild } = cfg.config;

  if (isCIBuild) return;

  let lastPercentage = 0;
  let startTime = Date.now();
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
    if (message === 'cache') return;

    if (lastPercentage === 0) {
      startTime = Date.now();
    }

    if (percent !== lastPercentage || message !== lastMessage) {
      displayProgressBar(percent, message);

      if (percent === 100) {
        progressBarVisible = false;

        if (message !== 'end' && lastMessage !== 'end') {
          // console.log(
          //   `percent-${percent}`,
          //   `message-${message}`,
          //   `lastPercentage-${lastPercentage}`,
          //   `lastMessage-${lastMessage}`
          // );
          readline.clearLine(process.stdout, 0);
          readline.cursorTo(process.stdout, 0);
          info(`Used time: ${Date.now() - startTime}ms`);
        }

        console.log = originalConsoleLog;
        lastPercentage = 0;
        lastMessage = '';
        return;
      }

      lastPercentage = percent;
      lastMessage = message;
    }
  };

  rspackCfg.plugins.push(new webpack.ProgressPlugin(handler));
};
