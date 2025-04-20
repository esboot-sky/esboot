import { join } from 'node:path';
import { ETemplate } from '../src/index';

export const rootDir = join(__dirname, '../../../');
export const supportedTemplate = [ETemplate.mp, ETemplate.sp, ETemplate.demo];
export type { ETemplate };
