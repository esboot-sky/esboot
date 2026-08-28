# AGENTS.md

This repository is the ESBoot monorepo, managed with pnpm workspaces and Turbo. It contains the CLI, shared configuration, bundler adapters, plugins, browser utilities, examples, and scaffolding tools.

## Project Shape

- Publishable packages live under `packages/`.
- Runnable integration examples live under `examples/`.
- Scaffolding and developer tools live under `tools/`.
- Treat `tmp/` and `retired/` as non-source unless a task explicitly targets them.
- Core ownership:
  - `packages/common`: shared config types, defaults, env loading, helpers, and plugin contracts.
  - `packages/esboot`: CLI, public config helpers, plugin lifecycle, prepare tasks, and bundler contract.
  - `packages/bundler-common`: behavior shared by bundlers.
  - `packages/bundler-vite`, `packages/bundler-webpack`, `packages/bundler-rspack`: bundler-specific implementations.
  - `packages/plugin-*`, `packages/browser*`, and `packages/lint`: plugins, browser runtime utilities, and generated tooling configuration.

## esboot Skill

- For any esboot-related work, use the `esboot` skill.
- If the skill is unavailable, install it with `npx skills add https://skillhub.dztec.net/api/skills/esboot/download`, then use it.

## Common Commands

- `pnpm install` installs workspace dependencies from the lockfile.
- `pnpm run dev` starts workspace development; `dev:vite`, `dev:webpack`, and `dev:rspack` scope development to a bundler.
- `pnpm run build`, `pnpm run lint`, and `pnpm run test` run repository-wide checks.
- `pnpm run test:e2e` runs Playwright; `pnpm run test:examples` runs example tests.
- Prefer focused commands while iterating, such as `pnpm --filter <package> run build`, `pnpm exec vitest run <test-file>`, and `pnpm exec eslint <changed-files>`.

## Style

- Follow surrounding conventions and prefer readable, direct TypeScript.
- Keep code ESM-first and compatible with the strict shared TypeScript configuration.
- Write code comments in English when necessary; keep them concise and only explain non-obvious design decisions.

## Working Rules

- Use `pnpm`; update `pnpm-lock.yaml` only when dependency changes require it.
- Reuse or extend existing helpers, components, and functions before creating focused, minimal alternatives. Shared helpers usually belong in `packages/common` or `packages/bundler-common`.
- Keep shared behavior in `bundler-common`; keep Vite, Webpack, and Rspack differences inside their adapters.
- Preserve public package exports, package names, config options, and generated-project compatibility unless the task explicitly includes a migration.
- Keep examples and `tools/create-esboot/templates/` aligned when changing user-facing conventions.
- Do not edit `dist/`, `.turbo/`, `.esboot/`, `.mfsu*`, `.dumi/`, `node_modules/`, or other generated/cache directories unless explicitly required.

## Architecture Boundaries

- Config schema and defaults: `packages/common/src/cfg/`.
- CLI and command lifecycle: `packages/esboot/src/cli/`.
- Plugin contracts and execution: `packages/common/src/plugin/` and `packages/esboot/src/plugin/`.
- Shared bundler behavior: `packages/bundler-common/`.
- Generated project templates: `tools/create-esboot/templates/`.
- For user-facing bundler behavior, check every affected adapter. Entry discovery, CSS Modules and `styleName`, static assets, language JSON, Tailwind, px2rem, minification, and code splitting are compatibility-sensitive.
- When config types or generated tooling change, update prepare generation and verify it against a relevant example.

## Verification

- Use red-green TDD for functional changes: add or update a focused test, confirm the intended failure, then implement the smallest passing change.
- Run the nearest focused test first, followed by lint and the affected package build.
- Run the relevant example build for user-facing behavior and all affected bundlers for cross-bundler changes.
- Use Playwright for browser behavior, routing, rendering, assets, and visual regressions.
- Use `pnpm run build`, `pnpm run test`, and `pnpm run test:examples` for broad changes.
- Report checks that could not be run and the reason; do not claim unverified results.
