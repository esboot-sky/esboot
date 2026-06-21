import { error } from '@dz-web/esboot-common/helpers';
import { huskySetup } from '@dz-web/esboot-lint';
import { cfg } from '@/cfg';
import { generateCommitlintCfg } from './generate-commitlint-cfg';
import { generatePrettierCfg } from './generate-prettier-cfg';
import { generateStylelintCfg } from './generate-stylelint-cfg';
import { generateTypeScriptCfg } from './generate-typescript-cfg';
import { generateTypeScriptTypes } from './generate-typescript-types';
import { updateVSCodeSetting } from './update-vscode-setting';

export type PrepareTaskStage = 'base' | 'local';

export interface PrepareTask {
  name: string;
  stage: PrepareTaskStage;
  run: () => void;
}

export const prepareTasks: PrepareTask[] = [
  {
    name: 'typescript-config',
    stage: 'base',
    run: generateTypeScriptCfg,
  },
  {
    name: 'typescript-types',
    stage: 'base',
    run: generateTypeScriptTypes,
  },
  {
    name: 'stylelint-config',
    stage: 'local',
    run: generateStylelintCfg,
  },
  {
    name: 'prettier-config',
    stage: 'local',
    run: generatePrettierCfg,
  },
  {
    name: 'commitlint-config',
    stage: 'local',
    run: generateCommitlintCfg,
  },
  {
    name: 'vscode-settings',
    stage: 'local',
    run: updateVSCodeSetting,
  },
  {
    name: 'husky-setup',
    stage: 'local',
    run: () => {
      try {
        huskySetup({ configRootPath: cfg.config.configRootPath });
      }
      catch (err) {
        error(`Setup husky failed: ${(err as Error).message}`);
      }
    },
  },
];
