import { extname } from 'node:path';
import { addHook } from 'pirates';
import type { Loader } from 'esbuild';

const COMPILE_EXTS = ['.ts', '.tsx', '.js', '.jsx'];
const HOOK_EXTS = [...COMPILE_EXTS, '.mjs'];

type Implementor = typeof import('esbuild');
let registered = false;
let files: string[] = [];
let revert: () => void = () => {};

function transform(opts: {
  code: string;
  filename: string;
  implementor: Implementor;
}) {
  const { code, filename, implementor } = opts;
  files.push(filename);
  const ext = extname(filename);
  try {
    return implementor.transformSync(code, {
      sourcefile: filename,
      loader: ext.slice(1) as Loader,
      target: 'es2021',
      format: 'esm',
      logLevel: 'error',
    }).code;
  } catch (e) {
    throw new Error(`Parse file failed: [${filename}]`, { cause: e });
  }
}

export function register(opts: { implementor: Implementor; exts?: string[] }) {
  files = [];
  if (!registered) {
    revert = addHook(
      (code, filename) =>
        transform({ code, filename, implementor: opts.implementor }),
      {
        ext: opts.exts || HOOK_EXTS,
        ignoreNodeModules: true,
      }
    );
    registered = true;
  }
}

export function getFiles() {
  return files;
}

export function clearFiles() {
  files = [];
}

export function restore() {
  revert();
  registered = false;
}
