# Environment Loading Precedence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Load ESBoot env files with `shell/CI > .env.local > .env.${NODE_ENV} > .env` precedence while preserving cross-file expansion and minimizing parsing work.

**Architecture:** `loadEnv` will pass the three ordered paths to one isolated `dotenv.config` call, expand the merged file values once against a shell-first lookup environment, and inject only keys absent from the real `process.env`. A focused test file will exercise observable `process.env` behavior using temporary directories.

**Tech Stack:** TypeScript, Node.js filesystem APIs, dotenv 17, dotenv-expand 12, Vitest

---

## File Structure

- Create `packages/common/src/cfg/__test__/load-env.test.ts`: regression tests for precedence, expansion, empty shell values, and missing `NODE_ENV`.
- Modify `packages/common/src/cfg/load-env.ts`: isolated multi-path load, one expansion pass, and shell-preserving injection.

### Task 1: Specify Environment Precedence and Expansion

**Files:**
- Create: `packages/common/src/cfg/__test__/load-env.test.ts`
- Test: `packages/common/src/cfg/__test__/load-env.test.ts`

- [x] **Step 1: Write the failing regression tests**

```typescript
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import process from 'node:process';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { loadEnv } from '../load-env';

const ENV_KEYS = [
  'NODE_ENV',
  'ESBOOT_TEST_PRIORITY',
  'ESBOOT_TEST_MODE_PRIORITY',
  'ESBOOT_TEST_HOST',
  'ESBOOT_TEST_URL',
  'ESBOOT_TEST_EMPTY',
] as const;

const tmpRoots: string[] = [];
let originalEnv: Map<(typeof ENV_KEYS)[number], string | undefined>;

async function createEnvProject(files: Record<string, string>): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), 'esboot-load-env-'));
  tmpRoots.push(root);
  await Promise.all(
    Object.entries(files).map(([name, contents]) => writeFile(join(root, name), contents)),
  );
  return root;
}

beforeEach(() => {
  originalEnv = new Map(ENV_KEYS.map(key => [key, process.env[key]] as const));
  for (const key of ENV_KEYS)
    delete process.env[key];
});

afterEach(async () => {
  await Promise.all(tmpRoots.splice(0).map(root => rm(root, { recursive: true, force: true })));
  for (const key of ENV_KEYS) {
    const value = originalEnv.get(key);
    if (value === undefined)
      delete process.env[key];
    else
      process.env[key] = value;
  }
});

describe('loadEnv', () => {
  it('loads env files from lowest to highest priority', async () => {
    process.env.NODE_ENV = 'test';
    const root = await createEnvProject({
      '.env': 'ESBOOT_TEST_PRIORITY=base\nESBOOT_TEST_MODE_PRIORITY=base\n',
      '.env.test': 'ESBOOT_TEST_PRIORITY=mode\nESBOOT_TEST_MODE_PRIORITY=mode\n',
      '.env.local': 'ESBOOT_TEST_PRIORITY=local\n',
    });

    loadEnv({ root });

    expect(process.env.ESBOOT_TEST_PRIORITY).toBe('local');
    expect(process.env.ESBOOT_TEST_MODE_PRIORITY).toBe('mode');
  });

  it('preserves a value supplied by the shell or CI', async () => {
    process.env.NODE_ENV = 'test';
    process.env.ESBOOT_TEST_PRIORITY = 'shell';
    const root = await createEnvProject({
      '.env': 'ESBOOT_TEST_PRIORITY=base\n',
      '.env.test': 'ESBOOT_TEST_PRIORITY=mode\n',
      '.env.local': 'ESBOOT_TEST_PRIORITY=local\n',
    });

    loadEnv({ root });

    expect(process.env.ESBOOT_TEST_PRIORITY).toBe('shell');
  });

  it('expands a local value from a lower-priority env file', async () => {
    process.env.NODE_ENV = 'test';
    const root = await createEnvProject({
      '.env': 'ESBOOT_TEST_HOST=base.example.com\n',
      '.env.local': `ESBOOT_TEST_URL=https://\${ESBOOT_TEST_HOST}/api\n`,
    });

    loadEnv({ root });

    expect(process.env.ESBOOT_TEST_URL).toBe('https://base.example.com/api');
  });

  it('uses a shell or CI value during expansion', async () => {
    process.env.NODE_ENV = 'test';
    process.env.ESBOOT_TEST_HOST = 'shell.example.com';
    const root = await createEnvProject({
      '.env': 'ESBOOT_TEST_HOST=base.example.com\n',
      '.env.local': `ESBOOT_TEST_URL=https://\${ESBOOT_TEST_HOST}/api\n`,
    });

    loadEnv({ root });

    expect(process.env.ESBOOT_TEST_HOST).toBe('shell.example.com');
    expect(process.env.ESBOOT_TEST_URL).toBe('https://shell.example.com/api');
  });

  it('preserves an explicitly empty shell or CI value', async () => {
    process.env.NODE_ENV = 'test';
    process.env.ESBOOT_TEST_EMPTY = '';
    const root = await createEnvProject({
      '.env': 'ESBOOT_TEST_EMPTY=base\n',
      '.env.local': 'ESBOOT_TEST_EMPTY=local\n',
    });

    loadEnv({ root });

    expect(process.env.ESBOOT_TEST_EMPTY).toBe('');
  });

  it('does not load a mode-specific file when NODE_ENV is absent', async () => {
    const root = await createEnvProject({
      '.env': 'ESBOOT_TEST_PRIORITY=base\n',
      '.env.undefined': 'ESBOOT_TEST_PRIORITY=mode\n',
    });

    loadEnv({ root });

    expect(process.env.ESBOOT_TEST_PRIORITY).toBe('base');
  });
});
```

- [x] **Step 2: Run the focused test to verify RED**

Run:

```bash
pnpm exec vitest run packages/common/src/cfg/__test__/load-env.test.ts
```

Expected: FAIL because the current loader does not read `.env.${NODE_ENV}` and overwrites shell/CI values.

### Task 2: Implement Isolated Single-Pass Loading

**Files:**
- Modify: `packages/common/src/cfg/load-env.ts`
- Test: `packages/common/src/cfg/__test__/load-env.test.ts`

- [x] **Step 1: Replace the per-file loader with isolated merge and expansion**

```typescript
import { join } from 'node:path';
import process from 'node:process';
import dotEnv from 'dotenv';
import dotEnvExpand from 'dotenv-expand';

export function loadEnv({ root }: { root: string }): void {
  const envFile = join(root, '.env');
  const envPaths = [envFile];
  if (process.env.NODE_ENV)
    envPaths.push(`${envFile}.${process.env.NODE_ENV}`);
  envPaths.push(`${envFile}.local`);

  const fileEnv: Record<string, string> = {};
  const { parsed = {} } = dotEnv.config({
    override: true,
    path: envPaths,
    processEnv: fileEnv,
    quiet: true,
  });
  const shellEnv = process.env as Record<string, string>;
  const fileEnvToInject = Object.fromEntries(
    Object.entries(parsed).filter(([key]) => !Object.hasOwn(shellEnv, key)),
  );
  const { parsed: expanded = {} } = dotEnvExpand.expand({
    parsed: fileEnvToInject,
    processEnv: {
      ...parsed,
      ...shellEnv,
    },
  });

  Object.assign(process.env, expanded);
}
```

- [x] **Step 2: Run the focused test to verify GREEN**

Run:

```bash
pnpm exec vitest run packages/common/src/cfg/__test__/load-env.test.ts
```

Expected: PASS with 6 passing tests.

- [x] **Step 3: Run the common-package tests**

Run:

```bash
pnpm --filter @dz-web/esboot-common test -- --run
```

Expected: PASS with no regressions in the common package.

- [x] **Step 4: Commit the behavior change**

```bash
git add packages/common/src/cfg/load-env.ts packages/common/src/cfg/__test__/load-env.test.ts
git commit -m "fix(common): preserve shell env precedence"
```

### Task 3: Verify Static Quality and Package Build

**Files:**
- Verify: `packages/common/src/cfg/load-env.ts`
- Verify: `packages/common/src/cfg/__test__/load-env.test.ts`

- [x] **Step 1: Lint the changed TypeScript files**

Run:

```bash
pnpm exec eslint packages/common/src/cfg/load-env.ts packages/common/src/cfg/__test__/load-env.test.ts
```

Expected: exit code 0 with no lint errors.

- [x] **Step 2: Build the common package**

Run:

```bash
pnpm --filter @dz-web/esboot-common run build
```

Expected: exit code 0 and successful tsup output for the common package.

- [x] **Step 3: Confirm the worktree only contains intentional changes**

Run:

```bash
git status --short
git diff --check
```

Expected: the pre-existing `examples/mp-base/esbootrc/webpack.ts` modification remains untouched; no new uncommitted env-loader changes remain after the implementation commit.
