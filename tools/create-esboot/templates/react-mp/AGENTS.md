# AGENTS.md

This repository is an esboot 4.x React and TypeScript starter for building PC and mobile applications that run in browser and native bridge environments.

## Project Shape

- esboot configuration lives in `.esbootrc.ts`; platform-specific build and runtime configuration lives under `config/`.
- Shared application code lives under `src/`, including APIs, constants, helpers, hooks, higher-order components, localization resources, styles, types, and utilities.
- Platform implementations live under `src/platforms/pc/` and `src/platforms/mobile/`, with `_browser/` and `_native/` variants where behavior differs by runtime.
- Page scaffolding tools and templates live under `dev/tools/` and are exposed through the `create-page` package script.

## esboot Skill

- For any esboot-related work, use the `esboot` skill.
- If the skill is unavailable, install it with `npx skills add https://skillhub.dztec.net/api/skills/esboot/download`, then use it.

## Common Commands

- `pnpm install` installs dependencies from the lockfile.
- `pnpm dev` starts development; `pnpm dev:rspack` explicitly uses Rspack.
- `pnpm build` creates a production build; `pnpm test` runs Vitest through esboot.
- `pnpm bridge-mock` starts the native bridge mock tooling.
- `pnpm docs:dev` serves documentation; `pnpm docs:build` builds it.
- `pnpm create-page` runs the local page scaffolding tool.

## Style

- Follow surrounding conventions and prefer readable, direct TypeScript.
- Write code comments in English when necessary; keep them concise and only explain non-obvious design decisions.

## Working Rules

- Use `pnpm`; keep `pnpm-lock.yaml` synchronized with dependency changes.
- Reuse or extend existing components, hooks, helpers, and utilities before creating focused, minimal alternatives.
- Keep shared behavior in `src/`; add platform-specific code only for real browser/native or PC/mobile differences, preserving existing naming conventions.
- Treat `.env` and `.env.local` values as environment-specific; do not commit secrets or expose their contents in logs or documentation.
- Do not edit generated files under `dist/` or esboot-managed cache files under `node_modules/.cache/esboot/`.

## Verification

- Use TDD for behavior changes: add or update a focused test, confirm it fails for the intended reason, then implement the smallest passing change.
- Run `pnpm test` after behavior changes and `pnpm build` after build, configuration, dependency, platform, or production-path changes.
- Report any checks that could not be run and the reason; do not claim unverified results.
