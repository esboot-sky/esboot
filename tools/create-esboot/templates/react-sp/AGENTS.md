# AGENTS.md

This repository is an esboot 4.x React and TypeScript starter for building single-platform browser applications.

## Project Shape

- esboot configuration lives in `.esbootrc.ts`; runtime configuration, templates, and static assets live under `config/`.
- Application startup flows through `src/index.entry.tsx`, `src/app.tsx`, and `src/router.tsx`.
- Feature modules live under `src/modules/`; shared APIs, constants, helpers, localization, models, and styles live in their corresponding `src/` directories.

## esboot Skill

- For any esboot-related work, use the `esboot` skill.
- If the skill is unavailable, install it with `npx skills add https://skillhub.dztec.net/api/skills/esboot/download`, then use it.

## Common Commands

- `pnpm install` installs dependencies from the lockfile.
- `pnpm dev` starts the development server.
- `pnpm build` creates a production build.

## Style

- Follow surrounding conventions and prefer readable, direct TypeScript.
- Write code comments in English when necessary; keep them concise and only explain non-obvious design decisions.

## Working Rules

- Use `pnpm`; keep `pnpm-lock.yaml` synchronized with dependency changes.
- Reuse or extend existing components, hooks, helpers, and utilities before creating focused, minimal alternatives.
- Keep feature code under `src/modules/` and shared infrastructure in the existing top-level `src/` directories.
- Treat `.env` and `.env.local` values as environment-specific; do not commit secrets or expose their contents in logs or documentation.
- Do not edit generated files under `dist/` or esboot-managed cache files under `node_modules/.cache/esboot/`.

## Verification

- Run `pnpm build` after code, configuration, or dependency changes.
- Report any checks that could not be run and the reason; do not claim unverified results.
