# Tailwind3 Plugin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an installable ESBoot plugin that switches a project to Tailwind 3, and prove it through an SP example test.

**Architecture:** Keep the plugin tiny and declarative. The plugin only patches ESBoot config with `tailwindVersion: '3'`; the bundler/runtime Tailwind logic stays in the shared PostCSS path that already understands `next` vs `3`. The example app consumes the plugin like a real project would, so the regression test covers both the plugin contract and project wiring.

**Tech Stack:** TypeScript, Vitest, ESBoot plugin hooks, existing SP example app config.

---

### Task 1: Add the Tailwind3 plugin package

**Files:**
- Create: `packages/plugin-tailwind3/package.json`
- Create: `packages/plugin-tailwind3/tsconfig.json`
- Create: `packages/plugin-tailwind3/tsup.config.ts`
- Create: `packages/plugin-tailwind3/src/index.ts`
- Create: `packages/plugin-tailwind3/src/index.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest';
import pluginTailwind3 from './index';

describe('plugin-tailwind3', () => {
  it('patches tailwindVersion to 3', () => {
    const plugin = pluginTailwind3();
    const patch = plugin.modifyConfig?.({} as any);

    expect(plugin.key).toBe('plugin-tailwind3');
    expect(patch).toEqual({ tailwindVersion: '3' });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run packages/plugin-tailwind3/src/index.test.ts`
Expected: FAIL because the package does not exist yet.

- [ ] **Step 3: Write minimal implementation**

```ts
import type { Plugin } from '@dz-web/esboot';
import { PluginHooks, definePlugin } from '@dz-web/esboot';

export default function pluginTailwind3(): Plugin {
  return definePlugin({
    key: 'plugin-tailwind3',
    [PluginHooks.modifyConfig]: () => ({
      tailwindVersion: '3',
    }),
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run packages/plugin-tailwind3/src/index.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/plugin-tailwind3
git commit -m "feat: add tailwind3 preset plugin"
```

### Task 2: Wire the plugin into the SP example and add a regression test

**Files:**
- Modify: `examples/sp-base/package.json`
- Modify: `examples/sp-base/esbootrc/vite.ts`
- Modify: `examples/sp-base/esbootrc/webpack.ts`
- Modify: `examples/sp-base/esbootrc/rspack.ts`
- Create: `examples/sp-base/src/test/tailwind3-plugin.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest';
import config from '../../esbootrc/vite.ts';

describe('sp-base tailwind3 wiring', () => {
  it('includes the tailwind3 plugin and patches config', () => {
    const tailwind3 = config.plugins?.find((plugin) => plugin.key === 'plugin-tailwind3');

    expect(tailwind3).toBeDefined();
    expect(tailwind3?.modifyConfig?.({} as any)).toEqual({ tailwindVersion: '3' });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run examples/sp-base/src/test/tailwind3-plugin.test.ts`
Expected: FAIL because the example config does not yet include the plugin.

- [ ] **Step 3: Write minimal implementation**

Add the plugin to each SP base bundler config and declare it in the example package manifest.

```ts
import pluginTailwind3 from '@dz-web/esboot-plugin-tailwind3';

plugins: [
  pluginTailwind3(),
  pluginDocs(),
  pluginVitest(),
  ...
]
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run examples/sp-base/src/test/tailwind3-plugin.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add examples/sp-base packages/plugin-tailwind3
git commit -m "feat: wire tailwind3 plugin into sp example"
```

### Task 3: Verify the package still builds cleanly

**Files:**
- Modify: `packages/bundler-common/package.json` only if the example wiring exposes a new missing peer

- [ ] **Step 1: Run the package build checks**

Run:
`pnpm --filter @dz-web/esboot-plugin-tailwind3 run build`
`pnpm --filter example-sp-base run test:unit -- --runInBand examples/sp-base/src/test/tailwind3-plugin.test.ts`

- [ ] **Step 2: Confirm lint/build stay green**

Run:
`pnpm exec eslint packages/plugin-tailwind3/src/index.ts packages/plugin-tailwind3/src/index.test.ts examples/sp-base/esbootrc/vite.ts examples/sp-base/esbootrc/webpack.ts examples/sp-base/esbootrc/rspack.ts examples/sp-base/src/test/tailwind3-plugin.test.ts`

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "test: cover tailwind3 preset plugin"
```
