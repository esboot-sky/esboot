# AGENTS.md

This repository is a minimal esboot React and TypeScript browser application template.

## Project Shape

- esboot configuration lives in `.esbootrc.ts`.
- Application startup flows through `src/index.entry.tsx` and `src/app.tsx`.
- Global styles live under `src/styles/`.

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
- Reuse or extend existing code before creating focused, minimal components or functions.
- Keep this starter small; add structure only when the application requires it.
- Do not edit generated files under `dist/` or esboot-managed cache files under `node_modules/.cache/esboot/`.

## Verification

- Run `pnpm build` after code, configuration, or dependency changes.
- Report any checks that could not be run and the reason; do not claim unverified results.
