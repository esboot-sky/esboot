import { PluginHooks } from '@dz-web/esboot-common/plugin';
import { cfg } from '@/cfg';
import {
  callPluginHookOfOnlyExec,
  pluginHooksDict,
} from '@/plugin';
import { prepareTasks } from './prepare-tasks';
import { resolvePrepareTasks, runPrepareTasks } from './resolve-prepare-tasks';
import { checkPnpmVersion } from './check-pnpm';

export function prepare(): void {
  checkPnpmVersion();
  runPrepareTasks(resolvePrepareTasks(prepareTasks, cfg.config.isCIBuild));

  callPluginHookOfOnlyExec(PluginHooks.prepare, pluginHooksDict, cfg.config);
}
