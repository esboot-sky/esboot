# ESLint Project Service Switch Design

## Goal

Make type-aware ESLint available by default in VSCode, normal CLI runs, and CI,
while keeping ESBoot's lint-staged pre-commit check fast.

## Configuration Contract

ESBoot exposes the `ESBOOT_ESLINT_PROJECT_SERVICE` environment variable.

- When the variable is absent, it defaults to `1` and `projectService` is enabled.
- When the variable is `1`, `projectService` is enabled.
- When the variable is `0`, `projectService` is disabled.

This preserves a simple opt-out contract and lets ESBoot disable the expensive
TypeScript project initialization only for pre-commit checks.

## ESLint Configuration

The shared React ESLint config continues to target `**/*.{jsx,ts,tsx}`. When
enabled, its parser options contain:

```ts
{
  projectService: true,
  tsconfigRootDir: process.cwd(),
}
```

`process.cwd()` points the TypeScript project service at the consuming project,
not the installed ESBoot package. The project service then uses that project's
`tsconfig.json` `files`, `include`, and `exclude` rules to decide which files
belong to the project. ESBoot does not duplicate those patterns in ESLint.

The generated ESBoot TypeScript config already includes `.esbootrc.ts`,
`src/**/*`, `globals.d.ts`, and the generated declarations. Plugin changes made
through `modifyTypescriptConfig` therefore remain the single source of truth.

When disabled, the shared config omits `projectService` and `tsconfigRootDir`
rather than passing false-like parser settings.

## Pre-commit Data Flow

`execGitHooks()` starts lint-staged with
`ESBOOT_ESLINT_PROJECT_SERVICE=0` in the child process environment. The
variable is inherited by lint-staged's ESLint processes:

```text
ESBoot pre-commit
  -> lint-staged (ESBOOT_ESLINT_PROJECT_SERVICE=0)
    -> eslint
      -> shared ESBoot config without projectService
```

The environment is passed through the existing `exec` options instead of shell
assignment syntax, so the behavior is cross-platform. VSCode, ordinary ESLint,
and CI do not receive this override and therefore use the enabled default.

## Error Behavior

When project service is enabled, linting a TypeScript file outside the consuming
project's TypeScript configuration may produce the normal typescript-eslint
"not found by the project service" parsing error. This is intentional: file
membership follows `tsconfig.json`. The pre-commit path avoids this error and
the initialization cost because project service is disabled there.

## Testing

Focused tests will verify:

1. The generated React config enables `projectService` by default.
2. The enabled config uses `process.cwd()` as `tsconfigRootDir`.
3. Setting `ESBOOT_ESLINT_PROJECT_SERVICE=0` omits both parser options.
4. `execGitHooks()` passes the disabling environment variable to lint-staged.
5. Existing lint package tests, lint, and package build remain successful.

Tests that change the environment must restore its prior value after each case
to prevent order-dependent failures.
