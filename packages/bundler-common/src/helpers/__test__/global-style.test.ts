import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getGlobalScssPathList, isGlobalStyleFile } from '../global-style';

describe('global style helpers', () => {
  it('treats only root styles as global for SP projects', () => {
    const rootPath = join('/project', 'src');
    const paths = getGlobalScssPathList(rootPath, true);

    expect(paths).toEqual([join(rootPath, './styles/')]);
    expect(isGlobalStyleFile(join(rootPath, 'styles/index.scss'), paths)).toBe(true);
    expect(isGlobalStyleFile(join(rootPath, 'views/home/app.scss'), paths)).toBe(false);
  });

  it('normalizes windows paths before matching global style files', () => {
    const rootPath = 'C:\\project\\src';
    const paths = getGlobalScssPathList(rootPath, true);

    expect(paths).toEqual(['C:/project/src/styles/']);
    expect(isGlobalStyleFile('C:/project/src/styles/index.scss', paths)).toBe(true);
    expect(isGlobalStyleFile('C:\\project\\src\\styles\\index.scss', paths)).toBe(true);
    expect(isGlobalStyleFile('C:/project/src/views/home/app.scss', paths)).toBe(false);
  });

  it('adds platform style folders as globals for MP projects', () => {
    const rootPath = join('/project', 'src');
    const paths = getGlobalScssPathList(rootPath, false);

    expect(paths).toEqual([
      join(rootPath, './styles/'),
      join(rootPath, './platforms/mobile/styles/'),
      join(rootPath, './platforms/pc/styles/'),
    ]);
    expect(isGlobalStyleFile(join(rootPath, 'platforms/mobile/styles/index.scss'), paths)).toBe(true);
    expect(isGlobalStyleFile(join(rootPath, 'platforms/mobile/modules/home/app.scss'), paths)).toBe(false);
  });
});
