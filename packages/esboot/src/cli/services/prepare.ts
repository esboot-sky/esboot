import { generateTypeScriptCfg } from './generate-typescript-cfg';

const basePath = '../../config';
export function prepare() {
  generateTypeScriptCfg(basePath);
}
