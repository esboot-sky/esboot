# AGENTS.md Guidance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create concise repository guidance that accurately describes this esboot React multi-platform project and requires the preinstalled `esboot` skill for esboot-related work.

**Architecture:** Add one root-level Markdown instruction file. Its project map and commands come from the current repository, while a dedicated esboot section controls agent workflow without adding any runtime behavior.

**Tech Stack:** Markdown, esboot 4.x, React 19, TypeScript, pnpm, Vitest, Rspack

---

### Task 1: Add repository agent guidance

**Files:**
- Create: `AGENTS.md`
- Reference: `package.json`
- Reference: `.esbootrc.ts`

- [ ] **Step 1: Create the root guidance file**

Create `AGENTS.md` with the following content:

```markdown
# AGENTS.md

This repository is **esboot-react-mp**, an esboot 4.x React and TypeScript starter for building PC and mobile applications that run in browser and native bridge environments.

## Project Shape

- esboot configuration lives in `.esbootrc.ts`; platform-specific build and runtime configuration lives under `config/`.
- Shared application code lives under `src/`, including APIs, constants, helpers, hooks, higher-order components, localization resources, styles, types, and utilities.
- Platform implementations live under `src/platforms/pc/` and `src/platforms/mobile/`, with `_browser/` and `_native/` variants where behavior differs by runtime.
- Page scaffolding tools and templates live under `dev/tools/` and are exposed through the `create-page` package script.
- Generated production assets live under `dist/`; do not edit them by hand.

## esboot Skill

- For any work involving esboot commands, configuration, plugins, build behavior, development servers, testing integration, documentation tooling, troubleshooting, migrations, or upgrades, use the installed `esboot` skill before analyzing or changing the project.
- Assume the user already has the `esboot` skill installed. Do not search for it, recommend installing it, or start an installation flow unless invoking the skill explicitly reports that it is unavailable.
- Follow the skill's current guidance instead of guessing esboot APIs or relying on generic Vite, Rspack, or Vitest conventions.

## Common Commands

- `pnpm install` installs dependencies using the pinned pnpm version and lockfile.
- `pnpm dev` starts the esboot development server.
- `pnpm dev:rspack` starts development with Rspack selected explicitly.
- `pnpm build` creates the production build through Rspack.
- `pnpm test` runs the test suite through the esboot Vitest plugin.
- `pnpm bridge-mock` starts the native bridge mock tooling.
- `pnpm docs:dev` starts the documentation development server.
- `pnpm docs:build` builds the documentation site.
- `pnpm create-page` runs the local page scaffolding tool.

## Working Rules

- Use `pnpm`; keep `pnpm-lock.yaml` synchronized with dependency changes.
- Follow existing TypeScript, React, and SCSS patterns in the nearest platform or shared module.
- Put shared behavior in `src/` and introduce platform-specific code only when browser/native or PC/mobile behavior differs.
- Preserve the existing platform matrix and naming conventions rather than adding runtime fallbacks that hide unsupported environments.
- Treat `.env` and `.env.local` values as environment-specific; do not commit secrets or expose their contents in logs or documentation.
- Do not edit generated files under `dist/` or esboot-managed cache files under `node_modules/.cache/esboot/`.

## Verification

- Use TDD for behavior changes: add or update a focused test, confirm it fails for the intended reason, then implement the smallest passing change.
- Run `pnpm test` after behavior changes.
- Run `pnpm build` after build, configuration, dependency, platform, or production-path changes.
- Run both `pnpm test` and `pnpm build` before concluding broad or release-facing changes.
- Report any checks that could not be run and the reason; do not claim unverified results.
```

- [ ] **Step 2: Verify documented paths and commands**

Run:

```bash
test -f .esbootrc.ts && test -d config && test -d src/platforms/pc && test -d src/platforms/mobile && test -d dev/tools
node -e "const p=require('./package.json'); for (const s of ['dev','dev:rspack','build','test','bridge-mock','docs:dev','docs:build','create-page']) { if (!p.scripts[s]) throw new Error('missing script: '+s) }"
```

Expected: both commands exit with status 0 and print no errors.

- [ ] **Step 3: Verify the esboot policy and file quality**

Run:

```bash
rg -n 'installed `esboot` skill|Assume the user already has the `esboot` skill installed|troubleshooting|upgrades' AGENTS.md
git diff --check
```

Expected: `rg` finds the esboot workflow rules and `git diff --check` prints no whitespace errors.

- [ ] **Step 4: Review and commit**

Run:

```bash
git diff -- AGENTS.md
git add AGENTS.md
git commit -m "docs: add repository agent guidance"
```

Expected: the diff contains only the approved repository guidance and the commit succeeds.
