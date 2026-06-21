import { PluginHooks } from '@dz-web/esboot-common/plugin';
import { cfg } from '@/cfg';
import {
  callPluginHookOfOnlyExec,
  pluginHooksDict,
} from '@/plugin';
import { prepareTasks } from './prepare-tasks';
import { resolvePrepareTasks, runPrepareTasks } from './resolve-prepare-tasks';

export function prepare(): void {
  runPrepareTasks(resolvePrepareTasks(prepareTasks, cfg.config.isCIBuild));

  callPluginHookOfOnlyExec(PluginHooks.prepare, pluginHooksDict, cfg.config);
}
