# AGENTS.md

Guidance for AI agents working in this repository. This file applies to the
entire repo unless a more specific `AGENTS.md` is added in a subdirectory.

## Project Shape

This is the ESBoot monorepo. It is a pnpm workspace managed with Turbo and
contains the ESBoot CLI, shared configuration code, multiple bundler adapters,
plugins, browser utilities, examples, and scaffolding tools.

Workspace roots are:

- `packages/*`: publishable ESBoot packages.
- `examples/*`: runnable sample applications used as integration fixtures.
- `tools/*`: developer/scaffolding tools such as `create-esboot` and the VSCode
  extension.
- `tmp/*`: workspace scratch area. Treat it as non-source unless the task says
  otherwise.

Core package roles:

- `packages/common`: shared config types/defaults, env loading, helpers,
  constants, plugin type definitions.
- `packages/esboot`: public CLI, `defineConfig`, `definePlugin`, plugin hook
  orchestration, prepare scripts, and base `Bundler` contract.
- `packages/bundler-common`: shared bundler helpers for entry discovery,
  defines, global style detection, PostCSS/Tailwind/px2rem, HTML injection, and
  React Compiler integration.
- `packages/bundler-vite`: Vite adapter. Builds Vite config in
  `src/cfg/get-cfg.ts`, serves HTML through Express plus Vite middleware, and
  owns Vite-specific plugins.
- `packages/bundler-webpack`: Webpack adapter. Owns MFSU, Babel config,
  webpack rules/plugins, and webpack-specific optimization.
- `packages/bundler-rspack`: Rspack adapter. Owns Rspack rules/plugins,
  SWC-based React handling, and Rspack-specific optimization.
- `packages/rspack-plugin-stylename`: Rust/WASM SWC plugin for Rspack
  `styleName` handling.
- `packages/plugin-vitest`, `packages/plugin-docs`, `packages/plugin-vue`:
  ESBoot plugins registered through `PluginHooks`.
- `packages/browser` and `packages/browser-react`: runtime browser utilities.
- `packages/lint`, `packages/eslint-plugin-esboot`,
  `packages/stylelint-config-esboot`: generated lint/prettier/commitlint
  support.

Examples:

- `examples/sp-base`: React single-platform sample. It can switch among Vite,
  Webpack, and Rspack by syncing files from `examples/sp-base/esbootrc/*`.
- `examples/mp-base`: React multi-platform sample. Platform/page type env vars
  decide which `src/platforms/<platform>/_<pageType>` content is active.
- `examples/react-admin`: Vite React admin sample.
- `examples/sp-base-vue`: Vite Vue sample using `@dz-web/esboot-plugin-vue`.

## Tooling

- Use pnpm. The repo declares `packageManager: pnpm@10.24.0`; Volta pins Node
  `22.13.0` and pnpm `10.14.0`.
- Root scripts:
  - `pnpm run build`: Turbo build for all packages.
  - `pnpm run dev`: Turbo dev/watch for all packages.
  - `pnpm run dev:vite`, `pnpm run dev:webpack`, `pnpm run dev:rspack`: watch
    core packages plus the chosen bundler package.
  - `pnpm run lint`: ESLint over `packages/**/src/**/*.ts`.
  - `pnpm run test`: Vitest root project runner.
  - `pnpm run test:examples`: runs example tests through each example package.
- Prefer scoped commands while iterating:
  - `pnpm --filter @dz-web/esboot-bundler-vite run build`
  - `pnpm --filter @dz-web/esboot run build`
  - `pnpm exec vitest run <test-file>`
  - `pnpm exec eslint <changed-files>`
- Example commands:
  - In `examples/sp-base`: `pnpm run dev:vite`, `pnpm run build:vite`,
    `pnpm run dev:webpack`, `pnpm run build:webpack`, `pnpm run dev:rspack`,
    `pnpm run build:rspack`.
  - In `examples/mp-base`: same pattern, plus `ESBOOT_PLATFORM` and
    `ESBOOT_PAGE_TYPE` influence multi-platform config.

## Style And Editing Rules

- This project is TDD-driven. For any functional change, write or update the
  relevant test case first, watch it fail for the expected reason, implement the
  smallest fix, then run the test again and confirm it passes.
- Keep code ESM-first. Most packages use `"type": "module"`.
- TypeScript config is strict and uses `moduleResolution: "bundler"`.
- Follow the root ESLint style: 2 spaces, semicolons, single quotes, trailing
  commas, arrow parens.
- Use existing helpers before adding new utilities. Shared helpers usually live
  in `packages/common` or `packages/bundler-common`.
- Do not edit `dist/`, `.turbo/`, `.esboot/`, `.mfsu*`, `.dumi`, `node_modules`,
  or other generated/cache directories unless the task explicitly targets
  release artifacts.
- Do not update `pnpm-lock.yaml` unless dependency changes require it.
- Avoid broad refactors across all bundlers unless the task explicitly asks for
  cross-bundler behavior. Vite, Webpack, and Rspack often have equivalent but
  not identical implementations.
- Preserve public package exports and package names. Changes in `exports`,
  `main`, `module`, `types`, or `files` affect publishing and consumers.

## Configuration Flow

Config defaults and user options are defined in `packages/common/src/cfg`.

Important files:

- `packages/common/src/cfg/default-cfg.ts`: global defaults.
- `packages/common/src/cfg/types.ts`: public user/config types.
- `packages/common/src/cfg/cfg.ts`: `ESBootCfg` loads env, loads user
  `.esbootrc.ts`, merges defaults, and derives SP/MP paths.
- `packages/esboot/src/cli/index.ts`: CLI entry. It loads config, prepares
  plugins, registers commands, and instantiates the configured bundler.

Default config details to preserve:

- Default alias is `@ -> src`; SP and MP modes add more aliases in
  `ESBootCfg`.
- `isSP: true` uses root `src` content and `src/styles` global style path.
- MP mode derives `ESBOOT_PLATFORM` and `ESBOOT_PAGE_TYPE`, adds platform
  aliases like `@mobile`, `@pc`, `@mobile-native`, and config/static paths.
- `useLangJsonPicker` defaults to `true` for MP and `false` for SP unless the
  user config explicitly sets it.
- Defaults include `css.modules.useStyleName: true`,
  `css.modules.localsConvention: "asIs"`, `useTailwindcss: true`,
  `minimize: true`, `svgr: true`, and React Compiler enabled for target `19`.

## Plugin System

Plugin shape is defined in `packages/common/src/plugin/type.ts`; hook storage
and execution are in `packages/esboot/src/plugin`.

Hook names include:

- `registerCommands`
- `prepare`
- `modifyConfig`
- `modifyTypescriptConfig`
- `modifyPrettierConfig`
- `modifyStylelintConfig`
- `modifyEslintConfig`
- `modifyBundlerConfig`
- `afterCompile`

Plugins must have a unique `key`. `definePlugin` is a typed identity helper.

`prepare` generates cached project files under `node_modules/.cache/esboot`,
including TypeScript types, TS config, lint configs, prettier config,
commitlint config, VSCode settings, and Husky setup. When changing config types
or generated type behavior, update prepare generation and verify with an example
`esboot prepare`.

## Bundler Architecture

All bundlers implement the `Bundler` contract from `packages/esboot`.

Vite:

- Entry point: `packages/bundler-vite/src/bundler.ts`.
- Config assembly: `packages/bundler-vite/src/cfg/get-cfg.ts`.
- Partials add entry, dev server, resolve, SVGR, copy, lang JSON picker, style,
  and build settings.
- Dev mode uses an Express app with Vite middleware and dynamic HTML resolution.
- `customConfig` can replace or mutate the final Vite config.

Webpack:

- Config assembly: `packages/bundler-webpack/src/cfg/index.ts`.
- Uses MFSU in development when enabled.
- Babel config lives in `src/cfg/rules/javascript/babelrc.config.ts`.
- Style rules and scoped class name hashing live under
  `src/cfg/rules/style`.

Rspack:

- Config assembly: `packages/bundler-rspack/src/cfg/index.ts`.
- React handling uses Rspack/SWC config.
- `styleName` support depends on `packages/rspack-plugin-stylename` and the
  Rspack style/rule pipeline.

Cross-bundler changes should be checked in all three adapters when behavior is
user-facing, especially entries, styles, defines, copy/static behavior,
minification, code splitting, and plugin hooks.

## Entry Discovery

Entry discovery is shared in `packages/bundler-common/src/helpers/add-entry.ts`.

- It searches `*.entry.ts` and `*.entry.tsx`.
- Env vars `ESBOOT_CONTENT_PATH`, `ESBOOT_CONTENT_PATTERN`, and
  `ESBOOT_CONTENT_IGNORE` affect discovery.
- Entry files can export metadata such as `title`, `template`, `name`,
  `langJsonPicker`, and `urlParams`.
- SP scans `src`; MP scans the derived
  `src/platforms/<platform>/_<pageType>` content root.

Do not break metadata extraction through `@umijs/ast/getExportProps`; examples
and plugins depend on it.

## Styles And `styleName`

This project has important CSS Module and `styleName` behavior.

Shared global style detection is in
`packages/bundler-common/src/helpers/global-style.ts`.

- SP global styles include `src/styles/`.
- MP global styles also include `src/platforms/mobile/styles/` and
  `src/platforms/pc/styles/`.
- Global style files must not be forced into CSS Modules.

Vite style behavior:

- `packages/bundler-vite/src/cfg/partials/add-style/index.ts` pushes the
  `react-styleName` plugin and configures Vite CSS Modules.
- Non-global `.scss` imports are automatically resolved with `?module`.
- `css.modules.useStyleName: false` disables JSX `styleName` transformation
  only; it must not disable automatic `.scss -> ?module` resolution.
- `css.modules.localsConvention: "asIs"` is translated to Vite's default by
  omitting `localsConvention`.
- CSS Module naming uses `[name]__[local]___[hash:base64:5]`, `hashPrefix:
  "prefix"`, `scopeBehaviour: "local"`, and `exportGlobals: true`.

Vite `styleName` transformer:

- Files: `packages/bundler-vite/src/plugins/react-style-name/index.ts` and
  `handle-style-name.ts`.
- It only transforms `.tsx`.
- It detects `.scss` imports, creates variables for side-effect imports, and
  transforms JSX `styleName` into `className={__styleName(...)}` before JSX
  compilation.
- It preserves existing `className` by passing it as the third helper argument.
- It supports dashed class names by looking up both `text2-cls` and `text2Cls`.
- It also retains the older runtime-call wrapper path for already-compiled
  `React.createElement`, `_jsx`, `_jsxs`, or `_jsxDEV`.
- Regression tests live in
  `packages/bundler-vite/src/plugins/react-style-name/index.test.ts`.

Webpack `styleName` behavior:

- Uses `@dz-web/babel-plugin-react-css-modules` when
  `css.modules.useStyleName` is enabled.
- Keep hash generation aligned with style rules through `getCssHashRule()`.

Rspack `styleName` behavior:

- Uses Rust/WASM SWC plugin package `@dz-web/rspack-plugin-stylename`.
- If changing class-name hashing semantics, check Vite, Webpack, and Rspack
  together.

## PostCSS, Tailwind, px2rem, SVGR

- Shared PostCSS helpers live in `packages/bundler-common/src/postcss`.
- `useTailwindcss` defaults to `true`; do not silently disable it.
- `px2rem` is optional and controlled by `px2rem.enable`; MP examples choose
  root value from `cfg.isMobile`.
- SVGR defaults to `true`; `plugin-vue` modifies SVGR plugin options and removes
  React Vite plugins from the final Vite config.

## Code Splitting And Minification

Code splitting has similar public names but bundler-specific implementation:

- Vite: `packages/bundler-vite/src/cfg/build/optimization`.
- Webpack: `packages/bundler-webpack/src/cfg/optimization/code-splitting`.
- Rspack: `packages/bundler-rspack/src/cfg/optimization/code-splitting`.

Public `CodeSplittingType` names differ slightly by bundler. Check each
`src/types.ts` before copying examples across adapters.

Minifier selection is configured through shared config types:

- `jsMinifier`: defaults to `terser`.
- `cssMinifier`: defaults to `cssnano`.
- `minimize`: defaults to `true`.

## Lang JSON Picker

`langJsonPicker` is entry metadata used to filter language JSON in production
or when configured. Implementations exist in:

- `packages/bundler-vite/src/plugins/add-plugin-lang-json-picker.ts`
- `packages/bundler-webpack/src/loaders/lang-json-picker`
- `packages/bundler-rspack/src/loaders/lang-json-picker`

MP examples and templates export `langJsonPicker` from entry files. Preserve
this behavior when changing entry discovery or JSON loading.

## Examples As Integration Fixtures

Treat examples as executable compatibility checks, not throwaway code.

- `examples/sp-base` should continue to work with Vite, Webpack, and Rspack.
- `examples/mp-base` should continue to work with platform/page type variants.
- `examples/react-admin` exercises Vite code splitting for a larger React app.
- `examples/sp-base-vue` exercises `plugin-vue`.
- `tools/create-esboot/templates/*` should stay aligned with example patterns
  when changing generated app conventions.

When changing user-facing behavior, run at least one focused package test and
the relevant example build. For bundler-wide behavior, prefer checking all
affected bundlers.

## Testing And Verification

Always run focused verification before claiming work is complete.

Functional changes must follow red-green TDD:

- Red: add or update a focused test that captures the intended behavior and
  confirm it fails before implementation.
- Green: implement the smallest change that makes the focused test pass.
- Verify: rerun the focused test, then run lint/build checks appropriate to the
  changed package or example.

Before optimization or refactoring, build a broad characterization test baseline
first. Do not start by changing implementation. Work from small to large:

- Unit tests for pure helpers, config merging, env derivation, path resolution,
  entry discovery, style/global-style decisions, code splitting helpers, and
  plugin hook behavior.
- Package-level integration tests for ESBoot config loading, prepare output,
  plugin registration, and each bundler config factory.
- Cross-bundler contract tests for user-facing behavior that should stay
  aligned across Vite, Webpack, and Rspack: entries, aliases, defines, CSS
  Modules, `styleName`, static copy, lang JSON picker, Tailwind, px2rem,
  minification, and code splitting.
- Example-app tests for `examples/sp-base`, `examples/mp-base`,
  `examples/react-admin`, and `examples/sp-base-vue`.
- UI and browser behavior tests must use Playwright where a real browser is
  needed. Cover page rendering, routing, generated HTML, CSS Modules,
  `styleName` styling, static assets, runtime config loading, language JSON
  behavior, and visible UI regressions.
- For UI changes, include interaction assertions and screenshots or visual
  checks when layout/styling is part of the behavior.
- Do not skip "boring" paths. CLI commands, generated config files, templates,
  example apps, and error paths need tests too.

The goal before large optimization is a safety net that captures existing
behavior. If behavior is unclear, write characterization tests that document the
current behavior before proposing changes.

Useful focused checks:

- `pnpm exec vitest run packages/bundler-vite/src/plugins/react-style-name/index.test.ts`
- `pnpm exec vitest run packages/common/src/utils/__test__/index.test.ts`
- `pnpm exec eslint <changed .ts/.tsx files>`
- `pnpm --filter @dz-web/esboot-bundler-vite run build`
- `pnpm --filter @dz-web/esboot-bundler-webpack run build`
- `pnpm --filter @dz-web/esboot-bundler-rspack run build`
- `pnpm --filter @dz-web/esboot run build`

Example-level checks:

- `cd examples/sp-base && pnpm run build:vite`
- `cd examples/sp-base && pnpm run build:webpack`
- `cd examples/sp-base && pnpm run build:rspack`
- `cd examples/mp-base && pnpm run build:vite`
- `cd examples/mp-base && pnpm run build:webpack`
- `cd examples/mp-base && pnpm run build:rspack`

Full checks are more expensive:

- `pnpm run build`
- `pnpm run test`
- `pnpm run test:examples`

## Change Safety Checklist

Before changing code, identify which layer owns the behavior:

- User config schema/defaults: `packages/common/src/cfg`.
- CLI command lifecycle: `packages/esboot/src/cli`.
- Plugin hooks: `packages/esboot/src/plugin` and `packages/common/src/plugin`.
- Shared bundler behavior: `packages/bundler-common`.
- Vite-only behavior: `packages/bundler-vite`.
- Webpack-only behavior: `packages/bundler-webpack`.
- Rspack-only behavior: `packages/bundler-rspack`.
- Generated project templates: `tools/create-esboot/templates`.

For compatibility-sensitive changes:

- Add or update a focused regression test near the changed package.
- Verify the example that reproduces the behavior.
- Keep SP and MP behavior distinct where config derivation says they differ.
- Keep Vite/Webpack/Rspack differences intentional and documented in code or
  tests.
- Do not remove public config options without migration guidance.
- Do not assume `useStyleName`, CSS Modules, Tailwind, px2rem, Lang JSON picker,
  React Compiler, MFSU, SVGR, or Vue plugin behavior is unused just because a
  single example does not exercise it.

## Current High-Risk Areas

- `styleName` handling differs by bundler and is easy to break during style
  refactors.
- Entry discovery affects page URLs, HTML generation, language JSON picking,
  and plugin hooks.
- `prepare` output controls IDE/lint/type behavior for consuming apps.
- `plugin-vue` mutates Vite plugins and manual chunks; React/Vue bundler
  assumptions can conflict.
- MP config depends on environment variables and derived platform paths.
- Webpack MFSU changes can affect dev-only behavior without affecting
  production builds.

When unsure, start with a small reproduction in an example or a package-level
test before refactoring shared code.
