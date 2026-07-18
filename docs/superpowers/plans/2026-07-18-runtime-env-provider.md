# Runtime Environment Provider Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Route ESBoot's Node-side environment-variable reads and writes through a replaceable `shellEnv` facade while preserving all current defaults and value semantics.

**Architecture:** Add a public `@dz-web/esboot-common/environment` module containing a stable facade and replaceable provider. The default provider delegates to `process.env`; packages consume raw strings from the facade and retain their existing domain-specific comparisons. Frontend compile-time `process.env.*` markers and standalone tool process boundaries remain unchanged.

**Tech Stack:** TypeScript, Node.js `process.env`, pnpm workspace, tsup, Vitest, ESLint

---

## File Structure

- Create `packages/common/src/environment/index.ts`: provider contract, process-backed provider, stable facade, provider replacement.
- Create `packages/common/src/environment/index.test.ts`: facade and provider unit tests.
- Modify `packages/common/tsup.config.ts`: publish the new environment entry.
- Modify `packages/common/src/cfg/load-env.ts`: load and inject `.env` values through the facade.
- Modify `packages/common/src/cfg/__test__/load-env.test.ts`: prove `.env` loading works with a non-process provider.
- Modify `packages/common/src/cfg/cfg.ts`: derive configuration and write `BROWSERSLIST_ENV` through the facade.
- Modify `packages/common/src/utils/environment.ts`: use the facade for environment predicates.
- Modify `packages/common/src/helpers/logger.ts`: use the facade for debug logging.
- Modify `packages/esboot/src/cli/index.ts`: set `NODE_ENV` through the facade.
- Modify `packages/esboot/src/cli/prepare/resolve-prepare-tasks.ts`: read prepare debug mode through the facade.
- Modify `packages/esboot/src/plugin/builtin/entry-log.ts`: read platform/page type through the facade.
- Modify `packages/lint/src/eslint.ts`: read the Project Service flag through the facade.
- Modify `packages/bundler-common/src/helpers/add-entry.ts`: read entry-discovery overrides through the facade.
- Modify `packages/bundler-common/src/helpers/inject-html.ts`: read bridge/version overrides through the facade.
- Modify `packages/bundler-webpack/src/cfg/plugins/add-plugin-bundle-analyzer.ts`: read the analyzer port through the facade.
- Modify `packages/plugin-vitest/config/vitest.config.ts`: read the Vitest marker through the facade.
- Modify `packages/plugin-docs/src/plugin.ts`: set Dumi runtime variables through the facade.
- Modify `packages/plugin-docs/config/.dumirc.ts`: snapshot environment definitions through the facade.
- Modify `tools/vscode-extension-esboot/src/sidebar/provider.ts`: read entry-selection environment values from the facade.
- Modify adjacent tests for each migrated behavior without changing existing environment-variable semantics.

### Task 1: Add the replaceable environment facade

**Files:**
- Create: `packages/common/src/environment/index.ts`
- Create: `packages/common/src/environment/index.test.ts`
- Modify: `packages/common/tsup.config.ts`

- [ ] **Step 1: Write failing facade tests**

Create tests covering fallback behavior, empty strings, mutations, snapshots,
bulk assignment, and provider replacement:

```ts
import process from 'node:process';
import { afterEach, describe, expect, it } from 'vitest';
import {
  createRecordEnvProvider,
  setShellEnvProvider,
  shellEnv,
} from './index';

const originalProvider = setShellEnvProvider(
  createRecordEnvProvider(process.env),
);

afterEach(() => {
  setShellEnvProvider(originalProvider);
});

describe('shellEnv', () => {
  it('reads, writes, deletes, and snapshots the active provider', () => {
    const source: Record<string, string | undefined> = { EMPTY: '' };
    setShellEnvProvider(createRecordEnvProvider(source));

    expect(shellEnv.get('MISSING')).toBeUndefined();
    expect(shellEnv.get('MISSING', 'fallback')).toBe('fallback');
    expect(shellEnv.get('EMPTY', 'fallback')).toBe('');
    expect(shellEnv.has('EMPTY')).toBe(true);

    shellEnv.set('VALUE', 'one');
    shellEnv.assign({ SECOND: 'two', SKIPPED: undefined });
    expect(shellEnv.toObject()).toEqual({
      EMPTY: '',
      VALUE: 'one',
      SECOND: 'two',
    });

    const snapshot = shellEnv.toObject();
    snapshot.VALUE = 'changed';
    expect(shellEnv.get('VALUE')).toBe('one');

    shellEnv.delete('VALUE');
    expect(shellEnv.has('VALUE')).toBe(false);
  });

  it('keeps the facade identity when replacing providers', () => {
    const facade = shellEnv;
    const previous = setShellEnvProvider(
      createRecordEnvProvider({ VALUE: 'replacement' }),
    );

    expect(shellEnv).toBe(facade);
    expect(shellEnv.get('VALUE')).toBe('replacement');
    expect(setShellEnvProvider(previous)).not.toBe(previous);
  });
});
```

- [ ] **Step 2: Run the test to verify RED**

Run:

```bash
pnpm exec vitest run packages/common/src/environment/index.test.ts
```

Expected: FAIL because `packages/common/src/environment/index.ts` does not
exist.

- [ ] **Step 3: Implement the minimal provider and facade**

Create `packages/common/src/environment/index.ts`:

```ts
import process from 'node:process';

export type EnvRecord = Record<string, string | undefined>;

export interface EnvProvider {
  get: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
  delete: (key: string) => void;
  has: (key: string) => boolean;
  toObject: () => EnvRecord;
}

export interface ShellEnv {
  get: {
    (key: string): string | undefined;
    (key: string, fallback: string): string;
  };
  set: (key: string, value: string) => void;
  delete: (key: string) => void;
  has: (key: string) => boolean;
  assign: (values: EnvRecord) => void;
  toObject: () => EnvRecord;
}

export function createRecordEnvProvider(source: EnvRecord): EnvProvider {
  return {
    get: key => source[key],
    set: (key, value) => {
      source[key] = value;
    },
    delete: (key) => {
      delete source[key];
    },
    has: key => Object.hasOwn(source, key),
    toObject: () => ({ ...source }),
  };
}

let provider: EnvProvider = createRecordEnvProvider(process.env);

export const shellEnv: ShellEnv = {
  get(key: string, fallback?: string): string | undefined {
    return provider.get(key) ?? fallback;
  },
  set(key: string, value: string): void {
    provider.set(key, value);
  },
  delete(key: string): void {
    provider.delete(key);
  },
  has(key: string): boolean {
    return provider.has(key);
  },
  assign(values: EnvRecord): void {
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined)
        provider.set(key, value);
    });
  },
  toObject(): EnvRecord {
    return provider.toObject();
  },
};

export function setShellEnvProvider(nextProvider: EnvProvider): EnvProvider {
  const previousProvider = provider;
  provider = nextProvider;
  return previousProvider;
}
```

Add `'src/environment/index.ts'` to the common package's tsup entry list.

- [ ] **Step 4: Run tests and build the public entry**

Run:

```bash
pnpm exec vitest run packages/common/src/environment/index.test.ts
pnpm --filter @dz-web/esboot-common run build
```

Expected: the facade tests pass and `dist/environment/index.js` plus its
declaration file are generated.

- [ ] **Step 5: Commit the facade**

```bash
git add packages/common/src/environment packages/common/tsup.config.ts
git commit -m "feat(common): add runtime environment facade"
```

### Task 2: Migrate common configuration and utilities

**Files:**
- Modify: `packages/common/src/cfg/load-env.ts`
- Modify: `packages/common/src/cfg/__test__/load-env.test.ts`
- Modify: `packages/common/src/cfg/cfg.ts`
- Modify: `packages/common/src/cfg/__test__/cfg.test.ts`
- Modify: `packages/common/src/utils/environment.ts`
- Modify: `packages/common/src/utils/__test__/index.test.ts`
- Modify: `packages/common/src/helpers/logger.ts`

- [ ] **Step 1: Add a failing non-process-provider load test**

Add an async test that installs a record provider, loads temporary `.env` files, and
asserts shell precedence and expansion through `shellEnv` while the matching
`process.env` keys remain absent:

```ts
it('loads and expands values through the active environment provider', async () => {
  const previous = setShellEnvProvider(createRecordEnvProvider({
    NODE_ENV: 'test',
    ESBOOT_TEST_HOST: 'provider.example.com',
  }));
  const root = await createEnvProject({
    '.env': 'ESBOOT_TEST_HOST=file.example.com\n',
    '.env.local': `ESBOOT_TEST_URL=https://\${ESBOOT_TEST_HOST}/api\n`,
  });

  try {
    loadEnv({ root });
    expect(shellEnv.get('ESBOOT_TEST_HOST')).toBe('provider.example.com');
    expect(shellEnv.get('ESBOOT_TEST_URL')).toBe(
      'https://provider.example.com/api',
    );
    expect(process.env.ESBOOT_TEST_URL).toBeUndefined();
  }
  finally {
    setShellEnvProvider(previous);
  }
});
```

Use the existing `createEnvProject` helper and variable names rather than
creating another fixture mechanism.

- [ ] **Step 2: Run the common tests to verify RED**

Run:

```bash
pnpm exec vitest run \
  packages/common/src/cfg/__test__/load-env.test.ts \
  packages/common/src/cfg/__test__/cfg.test.ts \
  packages/common/src/utils/__test__/index.test.ts
```

Expected: the new provider-based load test fails because `loadEnv` still reads
and writes `process.env` directly.

- [ ] **Step 3: Route common runtime access through `shellEnv`**

In `load-env.ts`, replace direct access with:

```ts
const nodeEnv = shellEnv.get('NODE_ENV');
if (nodeEnv)
  envPaths.push(`${envFile}.${nodeEnv}`);

const providerEnv = shellEnv.toObject();
const fileEnvToInject = Object.fromEntries(
  Object.entries(parsed).filter(([key]) => !shellEnv.has(key)),
);

const { parsed: expanded = {} } = dotEnvExpand.expand({
  parsed: fileEnvToInject,
  processEnv: {
    ...parsed,
    ...providerEnv,
  },
});

shellEnv.assign(expanded);
```

In `cfg.ts`, read each current key with `shellEnv.get`, preserving the existing
defaults, and replace the runtime write with:

```ts
shellEnv.set(
  'BROWSERSLIST_ENV',
  `${platform}-${pageType}-${Environment.prod}`,
);
```

Keep quoted define keys such as `'process.env.NODE_ENV'`; only source their
runtime value from `shellEnv.get('NODE_ENV')`.

Update `utils/environment.ts` and `helpers/logger.ts` to use `shellEnv.get`
with the exact existing comparisons.

- [ ] **Step 4: Run common regression tests**

Run:

```bash
pnpm exec vitest run \
  packages/common/src/environment/index.test.ts \
  packages/common/src/cfg/__test__/load-env.test.ts \
  packages/common/src/cfg/__test__/cfg.test.ts \
  packages/common/src/utils/__test__/index.test.ts
```

Expected: PASS with existing shell precedence, configuration derivation, and
environment predicates unchanged.

- [ ] **Step 5: Commit common migration**

```bash
git add packages/common/src/cfg packages/common/src/utils packages/common/src/helpers/logger.ts
git commit -m "refactor(common): use runtime environment facade"
```

### Task 3: Migrate ESBoot CLI and lint behavior

**Files:**
- Modify: `packages/esboot/src/cli/index.ts`
- Modify: `packages/esboot/src/cli/prepare/resolve-prepare-tasks.ts`
- Modify: `packages/esboot/src/cli/prepare/resolve-prepare-tasks.test.ts`
- Modify: `packages/esboot/src/plugin/builtin/entry-log.ts`
- Modify: `packages/esboot/src/plugin/builtin/entry-log.test.ts`
- Modify: `packages/lint/src/eslint.ts`
- Modify: `packages/lint/src/eslint.test.ts`

- [ ] **Step 1: Convert focused tests to a custom provider**

Update the prepare debug, entry log, and Project Service tests to install a
record provider instead of setting production inputs directly on
`process.env`. Restore the previous provider in `afterEach`:

```ts
let previousProvider: EnvProvider;

beforeEach(() => {
  previousProvider = setShellEnvProvider(createRecordEnvProvider({}));
});

afterEach(() => {
  setShellEnvProvider(previousProvider);
});
```

Set test inputs with `shellEnv.set`, for example:

```ts
shellEnv.set('ESBOOT_ESLINT_PROJECT_SERVICE', '0');
shellEnv.set('ESBOOT_PREPARE_DEBUG', '1');
shellEnv.set('ESBOOT_PLATFORM', 'pc');
```

- [ ] **Step 2: Run focused tests to verify RED**

Run:

```bash
pnpm exec vitest run \
  packages/esboot/src/cli/prepare/resolve-prepare-tasks.test.ts \
  packages/esboot/src/plugin/builtin/entry-log.test.ts \
  packages/lint/src/eslint.test.ts
```

Expected: FAIL because production code still bypasses the installed provider.

- [ ] **Step 3: Migrate production reads and writes**

Import `shellEnv` from `@dz-web/esboot-common/environment` and replace:

```ts
shellEnv.set('NODE_ENV', environment);

const isDebug = shellEnv.get('ESBOOT_PREPARE_DEBUG') === '1';

const platform = shellEnv.get('ESBOOT_PLATFORM');
const pageType = shellEnv.get('ESBOOT_PAGE_TYPE');

const useProjectService = shellEnv.get(
  'ESBOOT_ESLINT_PROJECT_SERVICE',
  '1',
) === '1';
```

Do not change `process.cwd()`, `process.argv`, or `process.exit()`; they are not
environment-variable access.

- [ ] **Step 4: Run tests and package builds**

Run:

```bash
pnpm exec vitest run \
  packages/esboot/src/cli/prepare/resolve-prepare-tasks.test.ts \
  packages/esboot/src/plugin/builtin/entry-log.test.ts \
  packages/lint/src/eslint.test.ts \
  packages/lint/src/index.test.ts
pnpm --filter @dz-web/esboot run build
pnpm --filter @dz-web/esboot-lint run build
```

Expected: all tests and builds pass; unset/`1`/`0` Project Service behavior is
unchanged.

- [ ] **Step 5: Commit CLI and lint migration**

```bash
git add packages/esboot/src packages/lint/src
git commit -m "refactor: use environment facade in cli and lint"
```

### Task 4: Migrate bundler runtime environment access

**Files:**
- Modify: `packages/bundler-common/src/helpers/add-entry.ts`
- Modify: `packages/bundler-common/src/helpers/__test__/add-entry.test.ts`
- Modify: `packages/bundler-common/src/helpers/inject-html.ts`
- Modify: `packages/bundler-common/src/helpers/__test__/inject-html.test.ts`
- Modify: `packages/bundler-webpack/src/cfg/plugins/add-plugin-bundle-analyzer.ts`
- Modify: `packages/bundler-webpack/src/cfg/plugins/analyzer.test.ts`

- [ ] **Step 1: Add provider-isolation tests**

Install an in-memory provider in the existing entry and HTML tests, then set
the same variables through `shellEnv`:

```ts
shellEnv.assign({
  ESBOOT_CONTENT_PATH: 'nested',
  ESBOOT_CONTENT_PATTERN: 'mobile-*',
  ESBOOT_CONTENT_IGNORE: 'ignored',
});
```

```ts
shellEnv.assign({
  BRIDGE_MOCK_HOST: 'mock.example.com',
  BRIDGE_MOCK_PORT: '4321',
  BUILD_VERSION: 'provider-version',
});
```

Update the existing Webpack analyzer test so it sets `ANALYZE_PORT` only in the
custom provider, invokes `addBundleAnalyzerPlugin`, and asserts the resulting
plugin's options contain `analyzerPort: 9001`.

- [ ] **Step 2: Run bundler tests to verify RED**

Run:

```bash
pnpm exec vitest run \
  packages/bundler-common/src/helpers/__test__/add-entry.test.ts \
  packages/bundler-common/src/helpers/__test__/inject-html.test.ts \
  packages/bundler-webpack/src/cfg/plugins/analyzer.test.ts
```

Expected: provider-isolation assertions fail because the helpers still read
`process.env`.

- [ ] **Step 3: Replace bundler reads with explicit facade calls**

Use raw string defaults exactly matching current behavior:

```ts
const contentPathFromEnv = shellEnv.get('ESBOOT_CONTENT_PATH', '');
const patternFromEnv = shellEnv.get('ESBOOT_CONTENT_PATTERN', '*');
const ignoreFromEnv = shellEnv.get('ESBOOT_CONTENT_IGNORE', ignore);
```

```ts
const bridgeMockHost = shellEnv.get('BRIDGE_MOCK_HOST');
const bridgeMockPort = shellEnv.get('BRIDGE_MOCK_PORT');
const buildVersion = shellEnv.get('BUILD_VERSION');
```

```ts
analyzerPort:
  Number(shellEnv.get('ANALYZE_PORT')) || DEFAULT_ANALYZE_PORT,
```

Rename only local variables where necessary; do not change URL construction,
glob patterns, fallback ordering, or numeric conversion.

- [ ] **Step 4: Run bundler tests and builds**

Run:

```bash
pnpm exec vitest run \
  packages/bundler-common/src/helpers/__test__/add-entry.test.ts \
  packages/bundler-common/src/helpers/__test__/inject-html.test.ts \
  packages/bundler-webpack/src/cfg/plugins/analyzer.test.ts
pnpm --filter @dz-web/esboot-bundler-common run build
pnpm --filter @dz-web/esboot-bundler-webpack run build
```

Expected: tests and builds pass.

- [ ] **Step 5: Commit bundler migration**

```bash
git add packages/bundler-common packages/bundler-webpack
git commit -m "refactor(bundlers): use runtime environment facade"
```

### Task 5: Migrate plugin and VSCode runtime access

**Files:**
- Modify: `packages/plugin-vitest/config/vitest.config.ts`
- Modify: `packages/plugin-docs/src/plugin.ts`
- Modify: `packages/plugin-docs/src/plugin.test.ts`
- Modify: `packages/plugin-docs/config/.dumirc.ts`
- Modify: `tools/vscode-extension-esboot/src/sidebar/provider.ts`

- [ ] **Step 1: Add plugin provider-isolation coverage**

Update the docs plugin test to use a custom provider and assert command setup
writes through the facade:

```ts
expect(shellEnv.get('APP_ROOT')).toBe('./docs');
expect(shellEnv.get('DUMI_THEME')).toContain('dumi-theme-lobehub');
expect(shellEnv.get('port')).toBe('8101');
```

In `packages/plugin-vitest/config/vitest.config.test.ts`, preserve the existing
own-repository condition but set `VITEST` through a custom provider and assert
the workspace Vite import path is selected.

The VSCode extension has no isolated unit harness for the sidebar provider.
Migrate its three entry-selection reads after the facade and bundler behavior
are covered, then verify the extension with its TypeScript check.

- [ ] **Step 2: Run focused tests to verify RED**

Run:

```bash
pnpm exec vitest run \
  packages/plugin-docs/src/plugin.test.ts \
  packages/plugin-vitest/config/vitest.config.test.ts
pnpm --filter esboot run check-types
```

Expected: the custom-provider assertions fail until production modules use the
facade. The VSCode type check may still pass at RED because this step changes
only its environment-access dependency.

- [ ] **Step 3: Migrate plugin and extension access**

Use:

```ts
const isOwnTest = shellEnv.get('VITEST') === 'true'
  && !process.cwd().includes('examples')
  && !process.cwd().includes('tmp');
```

```ts
shellEnv.set('APP_ROOT', APP_ROOT);
shellEnv.set('DUMI_THEME', dirname(
  fileURLToPath(import.meta.resolve('dumi-theme-lobehub/package.json')),
));
if (port)
  shellEnv.set('port', port);
```

In `.dumirc.ts`, keep the quoted compile-time key and change only its source:

```ts
'process.env': shellEnv.toObject(),
```

In the VSCode extension, replace the destructuring read with explicit
`shellEnv.get` calls and preserve the existing `'*'`/empty-string defaults.

- [ ] **Step 4: Run plugin and extension verification**

Run:

```bash
pnpm exec vitest run \
  packages/plugin-docs/src/plugin.test.ts \
  packages/plugin-vitest/config/vitest.config.test.ts
pnpm --filter @dz-web/esboot-plugin-docs run build
pnpm --filter @dz-web/esboot-plugin-vitest run build
pnpm --filter esboot run check-types
```

Expected: focused tests, plugin builds, and VSCode type checking pass.

- [ ] **Step 5: Commit plugin and extension migration**

```bash
git add packages/plugin-docs packages/plugin-vitest tools/vscode-extension-esboot
git commit -m "refactor: use environment facade in plugins and tools"
```

### Task 6: Audit boundaries and run full verification

**Files:**
- Modify if needed: files identified by the audit whose direct access is not an approved boundary
- Modify: `docs/superpowers/specs/2026-07-18-runtime-env-provider-design.md` only if implementation reveals a necessary clarified boundary

- [ ] **Step 1: Audit remaining production references**

Run:

```bash
rg -n "process\.env" packages examples tools \
  --glob '*.{ts,tsx,js,mjs,cjs}' \
  --glob '!**/*.test.ts' \
  --glob '!**/__test__/**' \
  --glob '!**/dist/**' \
  --glob '!**/node_modules/**'
```

Classify every remaining result as one of:

- quoted bundler define key;
- frontend compile-time replacement marker;
- example-only Node script outside the published runtime;
- standalone tool process boundary that intentionally does not depend on common.

There must be no unclassified direct access in ESBoot runtime packages.

- [ ] **Step 2: Run all focused tests**

Run:

```bash
pnpm exec vitest run \
  packages/common/src/environment/index.test.ts \
  packages/common/src/cfg/__test__/load-env.test.ts \
  packages/common/src/cfg/__test__/cfg.test.ts \
  packages/common/src/utils/__test__/index.test.ts \
  packages/esboot/src/cli/prepare/resolve-prepare-tasks.test.ts \
  packages/esboot/src/plugin/builtin/entry-log.test.ts \
  packages/lint/src/eslint.test.ts \
  packages/lint/src/index.test.ts \
  packages/bundler-common/src/helpers/__test__/add-entry.test.ts \
  packages/bundler-common/src/helpers/__test__/inject-html.test.ts \
  packages/bundler-webpack/src/cfg/plugins/analyzer.test.ts \
  packages/plugin-docs/src/plugin.test.ts \
  packages/plugin-vitest/config/vitest.config.test.ts
```

Expected: all focused tests pass.

- [ ] **Step 3: Lint every changed TypeScript file**

Run:

```bash
git diff --name-only --diff-filter=ACMR HEAD~5 -- '*.ts' '*.tsx' -z \
  | xargs -0 pnpm exec eslint
```

Expected: no ESLint errors.

- [ ] **Step 4: Build affected packages in dependency order**

Run:

```bash
pnpm --filter @dz-web/esboot-common run build
pnpm --filter @dz-web/esboot-lint run build
pnpm --filter @dz-web/esboot run build
pnpm --filter @dz-web/esboot-bundler-common run build
pnpm --filter @dz-web/esboot-bundler-webpack run build
pnpm --filter @dz-web/esboot-plugin-vitest run build
pnpm --filter @dz-web/esboot-plugin-docs run build
pnpm --filter esboot run check-types
```

Expected: every package builds successfully. Run common first so dependent
package resolution never races common's cleaned `dist` directory.

- [ ] **Step 5: Check patch integrity and commit audit fixes**

Run:

```bash
git diff --check
git status --short
```

If the audit required fixes, commit only those fixes:

```bash
git add -u packages tools/vscode-extension-esboot \
  docs/superpowers/specs/2026-07-18-runtime-env-provider-design.md
git commit -m "chore: complete runtime environment migration"
```

If no audit fixes were needed, do not create an empty commit.
