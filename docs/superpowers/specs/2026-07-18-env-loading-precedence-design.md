# Environment Loading Precedence Design

## Goal

Change ESBoot environment loading so that values use this precedence:

```text
shell/CI > .env.local > .env.${NODE_ENV} > .env
```

Environment variables may reference variables declared in any lower-priority
file. Values supplied by the shell or CI must also participate in expansion and
must never be overwritten by an env file.

## Scope

The change is limited to `packages/common/src/cfg/load-env.ts` and focused tests
for that loader. Existing callers continue to call `loadEnv({ root })`; there is
no public API change.

If `NODE_ENV` is absent, ESBoot loads `.env` and `.env.local` and does not try to
construct a mode-specific filename.

## Design

Build the ordered path list once:

1. `.env`
2. `.env.${NODE_ENV}`, when `NODE_ENV` is defined
3. `.env.local`

Call `dotenv.config` once with the path list, `override: true`, and an isolated
`processEnv` object. The path order and `override: true` make later files replace
earlier files inside the isolated result without modifying the real
`process.env`.

Expand the merged values once with `dotenv-expand`. Expansion receives an
isolated environment containing the merged file values followed by the real
shell/CI environment, so shell/CI values have the highest lookup precedence.

Before expansion, exclude keys that already exist in the real `process.env`
from the set of values to inject. This preserves shell/CI values, including an
explicit empty string. After expansion, copy only the remaining file-defined
keys into the real `process.env`.

Missing env files remain optional. Parsing or file-reading errors continue to
follow dotenv's result behavior; ESBoot does not add new logging or exceptions
in this change.

## Performance

The loader performs one dotenv configuration pass, one expansion pass, and one
injection pass. Each candidate file is read at most once. It removes the current
per-file `existsSync`, `dotenv.config`, and `dotenv-expand` cycle and avoids
repeated mutation of the global environment.

The work remains synchronous because configuration must be available before
the CLI loads ESBoot config, and the bounded maximum of three small files makes
asynchronous I/O unnecessary.

## Tests

Add focused tests that use temporary env files and restore `process.env` after
each case. Cover:

1. `.env.local` overrides `.env.${NODE_ENV}`, which overrides `.env`.
2. An existing shell/CI value overrides all env files.
3. `.env.local` can reference a value declared in `.env`.
4. Expansion uses a shell/CI value instead of the same key from an env file.
5. An explicitly empty shell/CI value is preserved.
6. With no `NODE_ENV`, only `.env` and `.env.local` participate.

No bundler behavior changes are expected beyond receiving the corrected values
through the existing `process.env` flow.
