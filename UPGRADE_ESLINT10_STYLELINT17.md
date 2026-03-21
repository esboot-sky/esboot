# ESLint 10 + Stylelint 17 Upgrade Record

## 1. Goal

Upgrade the monorepo lint toolchain from ESLint 9 / Stylelint 16 to ESLint 10 / Stylelint 17, while keeping behavior stable and avoiding business logic changes.

## 2. Final Versions

- ESLint: `10.1.0`
- Stylelint: `17.5.0`
- Node engine baseline aligned to ESLint 10 requirement:
	- `>=22.13.0` (or `>=20.19.0` / `>=24`)

## 3. Key Dependency Changes

### Root

- `eslint` -> `^10.1.0`
- `@antfu/eslint-config` -> `^7.7.3`
- `engines.node` -> `>=22.13.0`
- `volta.node` -> `22.13.0`

### packages/lint

- `eslint` -> `^10.1.0`
- `stylelint` -> `^17.5.0`
- `peerDependencies.stylelint` -> `^17.0.0`
- `@antfu/eslint-config` -> `^7.7.3`
- `@eslint-react/eslint-plugin` -> `^2.11.0` (kept on v2 line for antfu compatibility)
- `eslint-plugin-react-refresh` -> `^0.5.2`
- `typescript-eslint` -> `^8.57.1`

### packages/stylelint-config-esboot

- `@stylistic/stylelint-plugin` -> `^5.0.1`
- `stylelint-config-standard` -> `^40.0.0`
- `stylelint-scss` -> `^7.0.0`

### Example projects

- `examples/mp-base`, `examples/sp-base`, `examples/sp-base-vue`
	- `eslint` -> `^10.1.0`
	- `stylelint` -> `^17.5.0`
- `examples/sp-base-vue` engine floor aligned to `>=22.13.0`

## 4. Compatibility Fixes Added

### 4.1 ESLint v10 context/sourceCode API migration

Custom rules/plugins were updated to remove deprecated API usage removed in ESLint 10:

- `context.getSourceCode()` -> `context.sourceCode`
- `context.getFilename()` -> `context.filename`

Updated files:

- `packages/lint/src/plugins/esboot-jsonc.ts`
- `packages/eslint-plugin-esboot/lib/rules/no-cross-platform-imports.js`
- `packages/eslint-plugin-esboot/lib/rules/no-cross-platform-lib-imports.js`

### 4.2 Typed rule compatibility for React TS files

To prevent runtime crashes such as:

- `react/no-implicit-key requires type information`

default React config now enables parser services:

- `languageOptions.parserOptions.projectService = true`

Updated file:

- `packages/lint/src/eslint.ts`

This is a compatibility patch and does not alter business logic.

## 5. Validation Performed

- `pnpm install` completed (lockfile updated)
- `pnpm --filter @dz-web/esboot-lint run build` succeeded
- ESLint config load error resolved after plugin version alignment
- React TS lint run no longer reproduces typed-parser crash in example smoke test

## 6. Notes / Known Residual Warnings

Some peer warnings remain from third-party ecosystem declarations (common during early major adoption), for example:

- `eslint-plugin-react-hooks` peer range not yet declaring ESLint 10
- `eslint-plugin-react` peer range not yet declaring ESLint 10
- unrelated docs/example package peers (React/antd ranges)

These warnings are not functional blockers for this upgrade.

## 7. Changed Files (Upgrade Scope)

- `package.json`
- `pnpm-lock.yaml`
- `packages/lint/package.json`
- `packages/lint/src/eslint.ts`
- `packages/lint/src/plugins/esboot-jsonc.ts`
- `packages/stylelint-config-esboot/package.json`
- `packages/eslint-plugin-esboot/lib/rules/no-cross-platform-imports.js`
- `packages/eslint-plugin-esboot/lib/rules/no-cross-platform-lib-imports.js`
- `examples/mp-base/package.json`
- `examples/sp-base/package.json`
- `examples/sp-base-vue/package.json`

## 8. Why `@eslint-react/eslint-plugin` stays on v2

`@antfu/eslint-config@7.7.3` currently expects `@eslint-react/eslint-plugin` on `^2.11.0` line.
Upgrading to v3 causes config/plugin compatibility issues in current setup.

If antfu releases a fully compatible line for v3, this can be revisited in a follow-up upgrade.
