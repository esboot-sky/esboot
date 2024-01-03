import Webpack from 'webpack';
import chokidar from 'chokidar';
import WebpackDevServer from 'webpack-dev-server';
import { debounce } from 'lodash';

import { logBrand, error } from '@@/helpers/logger';
import { Environment } from '@@webpack/config/environment';
import { USER_CONFIG_FILE } from '@@/constants';
import getWebpackConfig from '@@webpack/config/config';
import esbootConfig from '@@/config';

export const WATCH_DEBOUNCE_STEP = 300;

export async function runDev() {
  let server: WebpackDevServer;

  const start = async () => {
    console.time('dev');
    const cfg = await getWebpackConfig({ env: Environment.dev });
    const compiler = Webpack(cfg);
    console.timeEnd('dev');

    logBrand();
    server = new WebpackDevServer(cfg.devServer, compiler);

    try {
      await server.start();
    } catch (err) {
      error(err);
    }
  };

  start();

  const watcher = chokidar.watch(USER_CONFIG_FILE, {
    ignoreInitial: true,
    cwd: process.cwd(),
  });

  watcher.on(
    'change',
    debounce(async () => {
      esbootConfig.initUserConfig(true);
      await server.stop();

      await start();
    }, WATCH_DEBOUNCE_STEP)
  );
}
