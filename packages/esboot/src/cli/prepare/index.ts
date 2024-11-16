import { huskySetup } from '@dz-web/esboot-lint';
import cfg from '@/cfg';
import {
  callPluginHookOfOnlyExec,
  PluginHooks,
  pluginHooksDict,
} from '@/plugin';
import { generateTypeScriptCfg } from './generate-typescript-cfg';
import { generateStylelintCfg } from './generate-stylelint-cfg';
import { generateESLintCfg } from './generate-eslint-cfg';
import { generatePrettierCfg } from './generate-prettier-cfg';
import { generateCommitlintCfg } from './generate-commitlint-cfg';
import { generateTypeScriptTypes } from './generate-typescript-types';
import { updateVSCodeSetting } from './update-vscode-setting';
import { error } from "@dz-web/esboot-common/helpers";

export function prepare() {
  try {
    huskySetup({ configRootPath: cfg.config.configRootPath });
  } catch (err) {
    error((err as Error).message);
  }

  generateTypeScriptCfg();
  generateStylelintCfg();
  generatePrettierCfg();
  generateESLintCfg();
  generateCommitlintCfg();
  generateTypeScriptTypes();

  updateVSCodeSetting();

  callPluginHookOfOnlyExec(PluginHooks.prepare, pluginHooksDict, cfg.config);
}
