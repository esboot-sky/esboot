import { generateTypeScriptCfg } from './generate-typescript-cfg';
import { generateStylelintCfg } from './generate-stylelint-cfg';
import { generateESLintCfg } from './generate-eslint-cfg';
import { generatePrettierCfg } from './generate-prettier-cfg';
import { generateCommitlintCfg } from './generate-commitlint-cfg';
import { generateTypeScriptTypes } from './generate-typescript-types';

export function prepare() {
  generateTypeScriptCfg();
  generateStylelintCfg();
  generatePrettierCfg();
  generateESLintCfg();
  generateCommitlintCfg();
  generateTypeScriptTypes();
}
