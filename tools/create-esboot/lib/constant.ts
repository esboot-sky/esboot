import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ETemplate } from '../src/index';

export const rootDir = join(fileURLToPath(import.meta.url), '../../../');
export const supportedTemplate = [ETemplate.mp, ETemplate.sp, ETemplate.demo];
export type { ETemplate };
