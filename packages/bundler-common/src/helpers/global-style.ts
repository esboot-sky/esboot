import path from 'node:path';

const PATH_SEPARATOR_RE = /\\/g;

function normalizePath(value: string): string {
  return value.replace(PATH_SEPARATOR_RE, '/');
}

export function getGlobalScssPathList(rootPath: string, isSP: boolean): string[] {
  const globalScssPathList = [normalizePath(path.join(rootPath, './styles/'))];

  if (!isSP) {
    globalScssPathList.push(
      normalizePath(path.join(rootPath, './platforms/mobile/styles/')),
      normalizePath(path.join(rootPath, './platforms/pc/styles/')),
    );
  }

  return globalScssPathList;
}

export function isGlobalStyleFile(filePath: string, globalScssPathList: string[]): boolean {
  const normalizedFilePath = normalizePath(filePath);

  return globalScssPathList.some(globalPath => normalizedFilePath.includes(normalizePath(globalPath)));
}
