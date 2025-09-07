import { error } from '@dz-web/esboot-common/helpers';
import { PluginHooks } from '@dz-web/esboot-common/plugin';
import { huskySetup } from '@dz-web/esboot-lint';
import { cfg } from '@/cfg';
import {
  callPluginHookOfOnlyExec,
  pluginHooksDict,
} from '@/plugin';
import { generateCommitlintCfg } from './generate-commitlint-cfg';
import { generatePrettierCfg } from './generate-prettier-cfg';
import { generateStylelintCfg } from './generate-stylelint-cfg';
import { generateTypeScriptCfg } from './generate-typescript-cfg';
import { generateTypeScriptTypes } from './generate-typescript-types';
import { updateVSCodeSetting } from './update-vscode-setting';

export function prepare(): void {
  const { isCIBuild } = cfg.config;

  generateTypeScriptCfg();
  generateTypeScriptTypes();

  if (!isCIBuild) {
    generateStylelintCfg();
    generatePrettierCfg();
    generateCommitlintCfg();
    updateVSCodeSetting();

    try {
      huskySetup({ configRootPath: cfg.config.configRootPath });
    }
    catch (err) {
      error((err as Error).message);
    }
  }

  callPluginHookOfOnlyExec(PluginHooks.prepare, pluginHooksDict, cfg.config);
}
