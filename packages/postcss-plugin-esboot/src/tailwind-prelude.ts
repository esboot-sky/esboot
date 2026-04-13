import type { Root } from 'postcss';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parse } from 'postcss';

type TailwindVersion = '3' | 'next';

interface TailwindPreludeDeps {
  resolveModulePath?: (specifier: string) => string;
  readFile?: (filePath: string) => string;
  statFileMtime?: (filePath: string) => number;
  parseCss?: (css: string, from?: string) => Root;
}

interface FileContentCacheEntry {
  content: string;
  mtime: number;
}

interface PreludeCacheEntry {
  signature: string;
  prelude: string;
  root: Root;
}

export interface TailwindPreludeManager {
  getTailwindPreludeRoot: (
    tailwindVersion: TailwindVersion,
    useSeparateTailwindImports: boolean,
    from?: string,
  ) => { prelude: string; root: Root };
}

const tailwindFileContentCache = new Map<string, FileContentCacheEntry>();
const tailwindPreludeCache = new Map<string, PreludeCacheEntry>();

const defaultDeps: Required<TailwindPreludeDeps> = {
  resolveModulePath: (specifier: string) => fileURLToPath(import.meta.resolve(specifier)),
  readFile: (filePath: string) => fs.readFileSync(filePath, 'utf8'),
  statFileMtime: (filePath: string) => fs.statSync(filePath).mtimeMs,
  parseCss: (css: string, from?: string) => parse(css, { from }),
};

function getTailwindFileContent(filePath: string, deps: Required<TailwindPreludeDeps>): string {
  const cached = tailwindFileContentCache.get(filePath);
  const currentMtime = deps.statFileMtime(filePath);

  if (cached && cached.mtime === currentMtime) {
    return cached.content;
  }

  const content = deps.readFile(filePath);
  tailwindFileContentCache.set(filePath, {
    content,
    mtime: currentMtime,
  });

  return content;
}

function buildTailwindPrelude(
  tailwindVersion: TailwindVersion,
  useSeparateTailwindImports: boolean,
  deps: Required<TailwindPreludeDeps>,
): { signature: string; prelude: string } {
  if (tailwindVersion === '3') {
    return {
      signature: '3',
      prelude: '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n',
    };
  }

  if (useSeparateTailwindImports) {
    const themeCssPath = deps.resolveModulePath('tailwindcss/theme.css');
    const preflightCssPath = deps.resolveModulePath('tailwindcss/preflight.css');
    const utilitiesCssPath = deps.resolveModulePath('tailwindcss/utilities.css');
    const themeCssContent = getTailwindFileContent(themeCssPath, deps);
    const preflightCssContent = getTailwindFileContent(preflightCssPath, deps);
    const utilitiesCssContent = getTailwindFileContent(utilitiesCssPath, deps);

    return {
      signature: [
        'next',
        'separate',
        `${themeCssPath}:${deps.statFileMtime(themeCssPath)}`,
        `${preflightCssPath}:${deps.statFileMtime(preflightCssPath)}`,
        `${utilitiesCssPath}:${deps.statFileMtime(utilitiesCssPath)}`,
      ].join('|'),
      prelude: [
        themeCssContent,
        preflightCssContent,
        utilitiesCssContent,
      ].join('\n'),
    };
  }

  const indexCssPath = deps.resolveModulePath('tailwindcss/index.css');
  const indexCssContent = getTailwindFileContent(indexCssPath, deps);

  return {
    signature: ['next', 'combined', `${indexCssPath}:${deps.statFileMtime(indexCssPath)}`].join('|'),
    prelude: indexCssContent,
  };
}

export function createTailwindPreludeManager(deps: TailwindPreludeDeps = {}): TailwindPreludeManager {
  const resolvedDeps: Required<TailwindPreludeDeps> = {
    ...defaultDeps,
    ...deps,
  };

  function getTailwindPreludeRoot(
    tailwindVersion: TailwindVersion,
    useSeparateTailwindImports: boolean,
    from?: string,
  ): { prelude: string; root: Root } {
    const cacheKey = `${tailwindVersion}:${useSeparateTailwindImports ? 'separate' : 'combined'}`;
    const cached = tailwindPreludeCache.get(cacheKey);
    const { signature, prelude } = buildTailwindPrelude(
      tailwindVersion,
      useSeparateTailwindImports,
      resolvedDeps,
    );

    if (cached && cached.signature === signature) {
      return {
        prelude: cached.prelude,
        root: cached.root.clone() as Root,
      };
    }

    const root = resolvedDeps.parseCss(prelude, from);
    tailwindPreludeCache.set(cacheKey, {
      signature,
      prelude,
      root: root.clone() as Root,
    });

    return {
      prelude,
      root,
    };
  }

  return {
    getTailwindPreludeRoot,
  };
}

const defaultTailwindPreludeManager = createTailwindPreludeManager();

export const getTailwindPreludeRoot = defaultTailwindPreludeManager.getTailwindPreludeRoot;
