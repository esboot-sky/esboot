# Runtime Environment Provider Design

## Goal

Centralize Node-side environment-variable access behind a stable ESBoot API so
runtime code no longer depends directly on `process.env`. The initial provider
continues to use `process.env`, while the abstraction allows a future provider
to source values from memory, configuration files, or another runtime system.

This refactor must preserve current environment-variable behavior.

## Scope

Migrate production Node-side runtime code in:

- `packages/common`
- `packages/esboot`
- bundler packages
- plugin packages
- Node-based tools where importing `@dz-web/esboot-common/environment` is
  appropriate

Keep direct `process.env.*` expressions when they are deliberately consumed as
frontend compile-time replacement markers. This includes application source,
templates, bundler `define` keys, and generated browser-facing configuration.

Tests may continue to manipulate `process.env` when verifying the default
provider or restoring process state.

## Architecture

Add a public `@dz-web/esboot-common/environment` entry backed by a small
environment facade:

```ts
export interface EnvProvider {
  get(key: string): string | undefined;
  set(key: string, value: string): void;
  delete(key: string): void;
  has(key: string): boolean;
  toObject(): Record<string, string | undefined>;
}

export interface ShellEnv {
  get(key: string): string | undefined;
  get(key: string, fallback: string): string;
  set(key: string, value: string): void;
  delete(key: string): void;
  has(key: string): boolean;
  assign(values: Record<string, string | undefined>): void;
  toObject(): Record<string, string | undefined>;
}
```

The exported `shellEnv` is a stable facade. Its default provider delegates to
`process.env`. The module exports
`setShellEnvProvider(provider: EnvProvider): EnvProvider` for tests and future
runtime integrations. It returns the previous provider so the caller can
restore it. Callers keep using the same `shellEnv` object after replacement.

The facade returns raw strings. It does not interpret booleans, numbers,
platform names, or modes because existing variables use different conventions.
Call sites retain explicit domain parsing, for example:

```ts
const useProjectService = shellEnv.get(
  'ESBOOT_ESLINT_PROJECT_SERVICE',
  '1',
) === '1';
```

## Provider Behavior

The process provider preserves Node semantics:

- Missing variables return `undefined`.
- `set` stores string values.
- `delete` removes a variable.
- `has` distinguishes a missing variable from one containing an empty string.
- `toObject` returns a snapshot so callers cannot mutate the provider without
  going through the facade.
- `assign` skips `undefined` values and writes all defined strings.

Replacing the provider affects the existing exported facade immediately. The
replacement API returns the previous provider so tests and embedding runtimes
can restore it safely.

## Data Flow

For ordinary reads and writes:

```text
ESBoot module -> shellEnv -> active EnvProvider -> process.env (initially)
```

For `.env` loading:

1. Read `NODE_ENV` through `shellEnv` to determine candidate files.
2. Snapshot the current provider through `toObject`.
3. Preserve values already owned by the active provider.
4. Expand file values with the provider snapshot as context.
5. Write expanded values through `shellEnv.assign`.

This keeps the existing shell-over-file precedence while allowing a non-process
provider to participate in the same flow.

## Migration Rules

- Replace production Node-side `process.env.KEY` reads with `shellEnv.get`.
- Replace destructuring from `process.env` with explicit facade reads and the
  same defaults.
- Replace writes and deletes with `shellEnv.set` and `shellEnv.delete`.
- Replace `Object.assign(process.env, values)` with `shellEnv.assign(values)`.
- Replace environment snapshots passed to child processes with
  `shellEnv.toObject()` plus command-specific overrides.
- Preserve all comparison values, defaults, casing, and empty-string behavior.
- Do not replace quoted keys such as `'process.env.NODE_ENV'` because those are
  bundler definitions, not runtime environment access.

## Error Handling

The facade does not swallow provider errors. A provider that cannot read or
write should surface its error to the caller, matching the direct and
synchronous nature of current environment access.

`assign` is intentionally simple and synchronous. It ignores `undefined`
entries instead of converting them to the string `"undefined"`.

## Testing

Add focused tests for:

- default process-backed get, set, delete, has, assign, and snapshot behavior;
- fallback values, including preservation of an explicitly empty string;
- replacing and restoring the active provider;
- facade identity remaining stable across provider replacement;
- `.env` precedence and expansion through the facade;
- `0`/`1` Project Service behavior after migration;
- existing ESBoot configuration derivation and Node-side consumers.

Run repository searches after migration to confirm remaining `process.env`
occurrences are tests, compile-time browser markers, generated definitions, or
explicit integration boundaries.

## Compatibility

The default provider remains `process.env`, so consumers observe the same
values and side effects. Existing environment-variable names and value formats
do not change. The new environment entry is additive; this design does not
remove the existing `Environment` enum or environment utility functions.
