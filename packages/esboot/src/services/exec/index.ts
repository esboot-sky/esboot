import { runExec as baseRunExec } from '@dz-web/esboot-utils';
import { join } from 'path';

export function runExec(args: any[]) {
  baseRunExec(join(__dirname, '../../../'), args);
}
