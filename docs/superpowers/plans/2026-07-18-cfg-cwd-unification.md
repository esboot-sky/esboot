# ESBoot Runtime CWD Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make ESBoot runtime paths derive from `cfg.config.cwd` without changing path suffixes, command behavior, configuration schema, or public exports.

**Architecture:** Add pure cache-path factories in common and migrate runtime callers that already receive ESBoot configuration. Remove legacy process-relative cache constants and keep `process.cwd()` only at bootstrap, ESLint, generic helper, and standalone-tool boundaries.

**Tech Stack:** TypeScript, Vitest, pnpm workspace, Vite, Webpack, MFSU, ESBoot plugin hooks.

---

### Task 1: Add common cache-path factories

**Files:**
- Create: `packages/common/src/constants/index.test.ts`
- Modify: `packages/common/src/constants/index.ts`

- [ ] **Step 1: Write failing path-factory tests**

Assert that:

```ts
expect(getCacheDir('/repo/app')).toBe('/repo/app/node_modules/.cache/esboot');
expect(getWebpackCacheDir('/repo/app')).toBe('/repo/app/node_modules/.cache/esboot/webpack-cache');
```

Also assert `cacheDir` and `webpackCacheDir` are no longer exported.

- [ ] **Step 2: Run the focused test and verify RED**

```bash
node_modules/.bin/vitest run packages/common/src/constants/index.test.ts
```

Expected: imports fail because the factory functions do not exist.

- [ ] **Step 3: Implement pure factories and remove legacy exports**

Add `getCacheDir(cwd)` and `getWebpackCacheDir(cwd)`. Remove the process-relative constants.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run the same Vitest command; expect all constants tests to pass.

### Task 2: Migrate prepare and Husky runtime paths

**Files:**
- Modify: `packages/esboot/src/cli/prepare/generate-typescript-cfg.ts`
- Modify: `packages/esboot/src/cli/prepare/generate-typescript-types.ts`
- Modify: `packages/esboot/src/cli/prepare/generate-prettier-cfg.ts`
- Modify: `packages/esboot/src/cli/prepare/generate-stylelint-cfg.ts`
- Modify: `packages/esboot/src/cli/prepare/generate-commitlint-cfg.ts`
- Modify: their adjacent `*.test.ts` files
- Modify: `packages/lint/src/index.ts`
- Modify: `packages/lint/src/index.test.ts`
- Modify: `packages/esboot/src/cli/prepare/prepare-tasks.ts`
- Modify: `packages/esboot/src/cli/prepare/index.test.ts`

- [ ] **Step 1: Update prepare tests to expect `getCacheDir(cfg.config.cwd)`**

Use a synthetic `/repo/app` cwd and mock `getCacheDir` to return `/repo/app/node_modules/.cache/esboot`. Assert every generated path retains its current suffix.

- [ ] **Step 2: Update Husky tests to require explicit cwd**

Call:

```ts
huskySetup({ cwd: '/repo/app', configRootPath: '/repo/config' });
```

Assert `.git` detection uses `/repo/app/.git`, and the prepare task passes both `cfg.config.cwd` and `cfg.config.configRootPath`.

- [ ] **Step 3: Run affected tests and verify RED**

```bash
node_modules/.bin/vitest run \
  packages/esboot/src/cli/prepare/generate-typescript-cfg.test.ts \
  packages/esboot/src/cli/prepare/generate-typescript-types.test.ts \
  packages/esboot/src/cli/prepare/generate-prettier-cfg.test.ts \
  packages/esboot/src/cli/prepare/generate-stylelint-cfg.test.ts \
  packages/esboot/src/cli/prepare/generate-commitlint-cfg.test.ts \
  packages/esboot/src/cli/prepare/index.test.ts \
  packages/lint/src/index.test.ts
```

Expected: failures show legacy module-scope cache paths and missing Husky cwd.

- [ ] **Step 4: Migrate prepare generators and Husky setup**

Inside each generator, read `cwd` from `cfg.config`, calculate `const cacheDir = getCacheDir(cwd)`, and retain all existing suffixes. Change `huskySetup` to accept cwd and pass it from `prepare-tasks.ts`.

- [ ] **Step 5: Run affected tests and verify GREEN**

Run the same Vitest command; expect all tests to pass.

### Task 3: Migrate Vite, Vitest, and Webpack runtime paths

**Files:**
- Modify: `packages/bundler-vite/src/cfg/get-cfg.ts`
- Modify: `packages/bundler-vite/src/cfg/get-cfg.test.ts`
- Modify: `packages/plugin-vitest/config/create-vitest-vite-config.ts`
- Modify: `packages/plugin-vitest/config/create-vitest-vite-config.test.ts`
- Modify: `packages/bundler-webpack/src/cfg/partials/add-cache.ts`
- Create: `packages/bundler-webpack/src/cfg/partials/add-cache.test.ts`
- Modify: `packages/bundler-webpack/src/cfg/helpers/mfsu.ts`
- Modify: `packages/bundler-webpack/src/cfg/helpers/mfsu.test.ts`
- Modify: `packages/bundler-webpack/src/cfg/rules/javascript/babelrc.config.ts`
- Create: `packages/bundler-webpack/src/cfg/rules/javascript/babelrc.config.test.ts`

- [ ] **Step 1: Write failing cfg-cwd assertions**

For a `/repo/app` configuration, assert the unchanged results:

```text
Vite cache:    /repo/app/node_modules/.cache/esboot/.vite
Vitest cache:  /repo/app/node_modules/.cache/esboot/.vite
Webpack cache: /repo/app/node_modules/.cache/esboot/webpack-cache
MFSU tmpBase:  /repo/app/node_modules/.cache/esboot/mfsu
Alias @:       /repo/app/src
```

- [ ] **Step 2: Run bundler tests and verify RED**

```bash
node_modules/.bin/vitest run \
  packages/bundler-vite/src/cfg/get-cfg.test.ts \
  packages/plugin-vitest/config/create-vitest-vite-config.test.ts \
  packages/bundler-webpack/src/cfg/partials/add-cache.test.ts \
  packages/bundler-webpack/src/cfg/helpers/mfsu.test.ts \
  packages/bundler-webpack/src/cfg/rules/javascript/babelrc.config.test.ts
```

Expected: assertions reveal paths still captured from process cwd.

- [ ] **Step 3: Replace legacy constants and direct process cwd**

Calculate cache directories inside each factory from `cfg.config.cwd`. Change Babel alias resolution from `process.cwd()` to the same configuration cwd. Preserve all option shapes and suffixes.

- [ ] **Step 4: Run bundler tests and verify GREEN**

Run the same five-file Vitest command; expect all to pass.

### Task 4: Migrate plugin artifact paths

**Files:**
- Modify: `packages/plugin-tailwind3/src/prepare.ts`
- Modify: `packages/plugin-tailwind3/src/prepare.test.ts`
- Modify: `packages/plugin-docs/src/plugin.ts`
- Modify: `packages/plugin-docs/src/plugin.test.ts`

- [ ] **Step 1: Remove cache-constant mocks and assert synthetic cfg cwd**

Tailwind prepare must write under `/repo/app/node_modules/.cache/esboot`. Docs command and prepare hooks must calculate their Dumi config under the cwd supplied to `registerCommands` and `prepare`.

- [ ] **Step 2: Run plugin tests and verify RED**

```bash
node_modules/.bin/vitest run \
  packages/plugin-tailwind3/src/prepare.test.ts \
  packages/plugin-docs/src/plugin.test.ts
```

Expected: tests fail while plugins still use module-scope legacy constants.

- [ ] **Step 3: Move path calculation into cfg-aware functions and hooks**

Pass Tailwind's cfg into artifact writing. In docs, compute the target path separately inside `registerCommands(cfg)` and `prepare(cfg)` while retaining the same relative command argument and output suffix.

- [ ] **Step 4: Run plugin tests and verify GREEN**

Run the same tests; expect all to pass.

### Task 5: Verify behavior and migration completeness

**Files:**
- Verify all files changed in Tasks 1-4
- Verify existing Project Service files remain behaviorally unchanged

- [ ] **Step 1: Search for prohibited internal legacy usage**

Run `rg` for `cacheDir`, `webpackCacheDir`, and `process.cwd()` and confirm remaining occurrences match the design boundary.

- [ ] **Step 2: Run all affected tests together**

```bash
node_modules/.bin/vitest run \
  packages/common/src/constants/index.test.ts \
  packages/esboot/src/cli/prepare/generate-typescript-cfg.test.ts \
  packages/esboot/src/cli/prepare/generate-typescript-types.test.ts \
  packages/esboot/src/cli/prepare/generate-prettier-cfg.test.ts \
  packages/esboot/src/cli/prepare/generate-stylelint-cfg.test.ts \
  packages/esboot/src/cli/prepare/generate-commitlint-cfg.test.ts \
  packages/esboot/src/cli/prepare/index.test.ts \
  packages/lint/src/index.test.ts \
  packages/lint/src/eslint.test.ts \
  packages/bundler-vite/src/cfg/get-cfg.test.ts \
  packages/plugin-vitest/config/create-vitest-vite-config.test.ts \
  packages/bundler-webpack/src/cfg/partials/add-cache.test.ts \
  packages/bundler-webpack/src/cfg/helpers/mfsu.test.ts \
  packages/bundler-webpack/src/cfg/rules/javascript/babelrc.config.test.ts \
  packages/plugin-tailwind3/src/prepare.test.ts \
  packages/plugin-docs/src/plugin.test.ts
```

Expected: zero failures.

- [ ] **Step 3: Lint changed TypeScript files**

Use the installed `node_modules/.bin/eslint` binary. Expect zero errors.

- [ ] **Step 4: Build affected packages**

From each affected package directory, run:

```bash
env NODE_ENV=production ../../node_modules/.bin/tsup
```

Affected directories are `packages/common`, `packages/lint`, `packages/esboot`,
`packages/bundler-vite`, `packages/bundler-webpack`, `packages/plugin-vitest`,
`packages/plugin-tailwind3`, and `packages/plugin-docs`. Expect every build to
exit zero.

- [ ] **Step 5: Inspect final diff without committing**

Run `git diff --check`, `git status --short`, and review the diff for path-only changes. Do not stage or commit.
