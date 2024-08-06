import { generateTypeScriptCfg } from './generate-typescript-cfg';
import { generateStylelintCfg } from "./generate-stylelint-cfg";

const basePath = '../../config';
export function prepare() {
  generateTypeScriptCfg(basePath);
  generateStylelintCfg();
}
