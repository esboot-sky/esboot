import path from 'node:path';

export function getGlobalScssPathList(rootPath: string, isSP: boolean): string[] {
  const globalScssPathList = [path.join(rootPath, './styles/')];

  if (!isSP) {
    globalScssPathList.push(
      path.join(rootPath, './platforms/mobile/styles/'),
      path.join(rootPath, './platforms/pc/styles/'),
    );
  }

  return globalScssPathList;
}

export function isGlobalStyleFile(filePath: string, globalScssPathList: string[]): boolean {
  return globalScssPathList.some(globalPath => filePath.includes(globalPath));
}
