import { generateTypeScriptCfg } from './generate-typescript-cfg';
import { generateStylelintCfg } from "./generate-stylelint-cfg";
import { generateESLintCfg } from "./generate-eslint-cfg";

const basePath = '../../config';
export function prepare() {
  generateTypeScriptCfg(basePath);
  generateStylelintCfg();
  generateESLintCfg();
}
