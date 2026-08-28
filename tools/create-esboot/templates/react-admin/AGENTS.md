# AGENTS.md

This repository is an esboot 4.x React and TypeScript starter for building modular administration applications.

## Project Shape

- esboot configuration lives in `.esbootrc.ts`; runtime configuration, templates, static assets, and plugins live under `config/`.
- Application startup flows through `src/index.entry.tsx`, `src/app.tsx`, and `src/router.tsx`.
- Feature code lives under `src/modules/`; reusable UI and infrastructure live under `src/components/`, `src/containers/`, `src/hooks/`, `src/hoc/`, `src/api/`, and `src/utils/`.
- Tests are colocated with the modules and helpers they cover as `*.test.ts` or `*.test.tsx`.

## esboot Skill

- For any esboot-related work, use the `esboot` skill.
- If the skill is unavailable, install it with `npx skills add https://skillhub.dztec.net/api/skills/esboot/download`, then use it.

## Common Commands

- `pnpm install` installs dependencies from the lockfile.
- `pnpm dev` starts the development server.
- `pnpm test` runs Vitest through esboot; `pnpm build` creates a production build.

## Style

- Follow surrounding conventions and prefer readable, direct TypeScript.
- Write code comments in English when necessary; keep them concise and only explain non-obvious design decisions.

## Working Rules

- Use `pnpm`; keep `pnpm-lock.yaml` synchronized with dependency changes.
- Reuse or extend existing components, containers, hooks, helpers, and utilities before creating focused, minimal alternatives.
- Keep feature-specific code within its `src/modules/` area and move code to shared directories only when multiple features reuse it.
- Preserve existing routing, permission, localization, and qiankun integration patterns.
- Treat `.env` and `.env.local` values as environment-specific; do not commit secrets or expose their contents in logs or documentation.
- Do not edit generated files under `dist/` or esboot-managed cache files under `node_modules/.cache/esboot/`.

## Verification

- Use TDD for behavior changes: add or update a focused test, confirm it fails for the intended reason, then implement the smallest passing change.
- Run `pnpm test` after behavior changes and `pnpm build` after build, configuration, dependency, or production-path changes.
- Report any checks that could not be run and the reason; do not claim unverified results.
