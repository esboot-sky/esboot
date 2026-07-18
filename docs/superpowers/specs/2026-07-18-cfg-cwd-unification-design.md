# ESBoot Runtime CWD Unification Design

## Goal

Make ESBoot runtime paths derive from the active `cfg.config.cwd` without
changing existing output locations, command behavior, or public package
exports.

## Boundary

Code that runs after ESBoot configuration is available must derive project
paths from the `cwd` carried by that configuration. Code that establishes the
initial project context or runs independently of ESBoot configuration keeps
using `process.cwd()`.

The following remain process-boundary uses:

- the initial `defaultCfg.cwd` value;
- ESBoot CLI bootstrap before configuration loading;
- ESLint `tsconfigRootDir`, because VSCode loads ESLint independently;
- generic common helpers' fallback values;
- standalone create-esboot and codemod tools;
- configuration modules loaded directly by Dumi or Vitest.

## Path Factories

Common constants will add explicit path factories:

```ts
export function getCacheDir(cwd: string): string {
  return resolve(cwd, 'node_modules/.cache/esboot');
}

export function getWebpackCacheDir(cwd: string): string {
  return join(getCacheDir(cwd), 'webpack-cache');
}
```

The process-relative `cacheDir` and `webpackCacheDir` exports are removed. All
callers must select a project cwd explicitly through the path factories.

## Runtime Migration

Prepare generators, bundler configurations, and ESBoot plugins calculate cache
and output paths inside functions using the active configuration's `cwd`.
Module-scope paths that currently capture `process.cwd()` through `cacheDir`
move into the relevant hook or factory.

Specific behavior remains unchanged:

- prepare files still go under `node_modules/.cache/esboot`;
- Vite, Webpack, MFSU, Dumi, Tailwind, and Vitest cache subdirectories retain
  their existing names;
- Webpack aliases resolve to the same paths when ESBoot is started from the
  project root;
- Husky setup still checks the consuming project's `.git` directory and writes
  to the same config root.

`huskySetup` receives `cwd` explicitly from `cfg.config.cwd`. Webpack Babel
alias resolution uses the `cwd` already present in its `ConfigurationInstance`.
Plugin hooks use their existing configuration arguments rather than importing
global mutable state.

## Compatibility

No configuration schema changes are introduced. No environment variables or
mutable global cwd registries are added. Removing the legacy cache constants is
an intentional public breaking change authorized for this refactor.

## Testing

Characterization tests first capture each current path when configuration cwd
equals the process cwd. Regression tests then use a different synthetic cwd and
verify that runtime paths follow configuration without changing their suffixes.

Focused coverage includes:

1. common cache and webpack-cache path factories;
2. Husky repository detection using the supplied cwd;
3. Webpack alias and MFSU paths;
4. Vite and Vitest cache directories;
5. prepare, docs, and Tailwind artifact paths;
6. affected package tests, lint, and builds.

The existing uncommitted Project Service change remains separate in intent.
Its ESLint `tsconfigRootDir: process.cwd()` is explicitly outside this migration.
