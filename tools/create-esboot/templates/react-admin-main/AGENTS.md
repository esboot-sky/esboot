# AGENTS.md

This repository is an esboot 4.x React and TypeScript administration shell with qiankun integration.

## Project Shape

- esboot configuration lives in `.esbootrc.ts`; runtime configuration, templates, and static assets live under `config/`.
- Application startup flows through `src/index.entry.tsx`, `src/app.tsx`, and `src/router.tsx`.
- Feature modules live under `src/modules/`; shared shell UI lives under `src/components/` and shared infrastructure under the other top-level `src/` directories.
- qiankun integration lives in `src/helpers/qiankun/` and `src/utils/qiankun.ts`.
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
- Reuse or extend existing components, hooks, helpers, and utilities before creating focused, minimal alternatives.
- Keep feature-specific code under `src/modules/` and shared shell behavior in the existing top-level `src/` directories.
- Keep qiankun registration, routing, and shared state changes consistent across `src/helpers/qiankun/`, `src/utils/qiankun.ts`, and the application shell.
- Treat `.env` and `.env.local` values as environment-specific; do not commit secrets or expose their contents in logs or documentation.
- Do not edit generated files under `dist/` or esboot-managed cache files under `node_modules/.cache/esboot/`.

## Verification

- Use TDD for behavior changes: add or update a focused test, confirm it fails for the intended reason, then implement the smallest passing change.
- Run `pnpm test` after behavior changes and `pnpm build` after build, configuration, dependency, or production-path changes.
- Report any checks that could not be run and the reason; do not claim unverified results.
