import { searchCommand as baseSearchCommand } from '@dz-web/esboot-utils';
import { join } from 'path';

export function searchCommand(command: string) {
  return baseSearchCommand(join(__dirname, '../../'), command);
}
