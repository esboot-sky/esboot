# ESLint Project Service Switch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable typescript-eslint Project Service by default for editor, CLI, and CI linting while disabling it for ESBoot's lint-staged pre-commit process.

**Architecture:** The shared ESLint factory reads `ESBOOT_ESLINT_PROJECT_SERVICE` each time it builds a config, defaults it to `1`, and omits Project Service when the value is `0`. The pre-commit hook passes `0` through the child-process environment so lint-staged and its ESLint workers inherit the fast mode.

**Tech Stack:** TypeScript, ESLint flat config, typescript-eslint Project Service, Vitest, execa, lint-staged.

---

### Task 1: Add ESLint factory regression coverage

**Files:**
- Modify: `packages/lint/src/eslint.test.ts`
- Test: `packages/lint/src/eslint.test.ts`

- [ ] **Step 1: Preserve and restore the environment variable in test setup**

Add `beforeEach`/`afterEach` coverage that deletes `ESBOOT_ESLINT_PROJECT_SERVICE` before each test and restores its original value afterward.

- [ ] **Step 2: Write the default-enabled failing test**

Build the config with the variable absent, find the React config matching `**/*.{jsx,ts,tsx}`, and assert:

```ts
expect(reactConfig?.languageOptions?.parserOptions).toMatchObject({
  projectService: true,
  tsconfigRootDir: process.cwd(),
});
```

- [ ] **Step 3: Write the explicit-disable failing test**

Set `process.env.ESBOOT_ESLINT_PROJECT_SERVICE = '0'`, build the config, and assert that `projectService` and `tsconfigRootDir` are absent from the React parser options.

- [ ] **Step 4: Run the focused test and verify RED**

Run:

```bash
pnpm exec vitest run packages/lint/src/eslint.test.ts
```

Expected: the default-enabled test fails because `projectService` is currently omitted.

### Task 2: Implement the ESLint environment switch

**Files:**
- Modify: `packages/lint/src/eslint.ts`
- Test: `packages/lint/src/eslint.test.ts`

- [ ] **Step 1: Read the environment variable while building React config**

Import `process` from `node:process` and define enabled state as:

```ts
const { ESBOOT_ESLINT_PROJECT_SERVICE = '1' } = process.env;
const useProjectService = ESBOOT_ESLINT_PROJECT_SERVICE === '1';
```

- [ ] **Step 2: Add parser options only when enabled**

Replace the commented parser option with a conditional object containing:

```ts
projectService: true,
tsconfigRootDir: process.cwd(),
```

When disabled, return an empty parser options object.

- [ ] **Step 3: Run the focused test and verify GREEN**

Run:

```bash
pnpm exec vitest run packages/lint/src/eslint.test.ts
```

Expected: all ESLint factory tests pass.

### Task 3: Disable Project Service for pre-commit

**Files:**
- Modify: `packages/lint/src/index.test.ts`
- Modify: `packages/lint/src/index.ts`
- Test: `packages/lint/src/index.test.ts`

- [ ] **Step 1: Write the pre-commit environment failing test**

In the JavaScript-only staged-files test, assert the lint-staged `exec` call contains:

```ts
options: {
  env: {
    ESBOOT_ESLINT_PROJECT_SERVICE: '0',
  },
},
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
pnpm exec vitest run packages/lint/src/index.test.ts
```

Expected: the new assertion fails because the environment override is absent.

- [ ] **Step 3: Pass the environment to lint-staged**

Add the environment object to the existing `exec` options for the ESLint lint-staged invocation. Do not change stylelint or commit-message behavior.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run:

```bash
pnpm exec vitest run packages/lint/src/index.test.ts
```

Expected: all runtime helper tests pass.

### Task 4: Verify the lint package

**Files:**
- Verify: `packages/lint/src/eslint.ts`
- Verify: `packages/lint/src/eslint.test.ts`
- Verify: `packages/lint/src/index.ts`
- Verify: `packages/lint/src/index.test.ts`

- [ ] **Step 1: Run both focused test files together**

```bash
pnpm exec vitest run packages/lint/src/eslint.test.ts packages/lint/src/index.test.ts
```

Expected: all tests pass without warnings or unhandled errors.

- [ ] **Step 2: Lint all changed TypeScript files**

```bash
pnpm exec eslint packages/lint/src/eslint.ts packages/lint/src/eslint.test.ts packages/lint/src/index.ts packages/lint/src/index.test.ts
```

Expected: zero ESLint errors.

- [ ] **Step 3: Build the lint package**

```bash
pnpm --filter @dz-web/esboot-lint run build
```

Expected: package build exits successfully.

- [ ] **Step 4: Inspect the final diff**

Confirm the diff contains only the agreed environment switch, regression tests, and uncommitted planning document. Do not create a commit.
