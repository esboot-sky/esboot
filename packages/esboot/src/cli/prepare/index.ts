import { generateTypeScriptCfg } from './generate-typescript-cfg';
import { generateStylelintCfg } from './generate-stylelint-cfg';
import { generateESLintCfg } from './generate-eslint-cfg';
import { generatePrettierCfg } from './generate-prettier-cfg';
import { generateCommitlintCfg } from './generate-commitlint-cfg';

const basePath = '../../config';
export function prepare() {
  generateTypeScriptCfg(basePath);
  generateStylelintCfg();
  generatePrettierCfg(basePath);
  generateESLintCfg();
  generateCommitlintCfg();
}
