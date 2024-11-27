import { resolve } from 'node:path';
import chokidar from 'chokidar';
import { info } from '@dz-web/esboot-common/helpers';
import { getUserConfigFile } from '@dz-web/esboot-common';
import { debounce } from '@dz-web/esboot-common/lodash';
import type { ConfigurationInstance } from '@dz-web/esboot';

const WATCH_DEBOUNCE_STEP = 1000;
export function watchOnFileChange<T extends (path: string) => Promise<void>>(
  cfg: ConfigurationInstance,
  cb: T
) {
  const { cwd } = cfg.config;

  const watcher = chokidar.watch(
    [getUserConfigFile(cwd), resolve(cwd, '.env.local'), resolve(cwd, '.env')],
    {
      ignoreInitial: true,
      cwd,
    }
  );

  watcher.on(
    'change',
    debounce(async (path) => {
      info(`${path} file changed, start to recompile...`);
      await cb(path);
    }, WATCH_DEBOUNCE_STEP)
  );
}
