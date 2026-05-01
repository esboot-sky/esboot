# ESBoot

![pnpm](https://img.shields.io/badge/pnpm-10.14.0-f69220?logo=pnpm&logoColor=white)
![node](https://img.shields.io/badge/node-22.13.0-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178c6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Supported-646cff?logo=vite&logoColor=white)
![Webpack](https://img.shields.io/badge/Webpack-Supported-8dd6f9?logo=webpack&logoColor=1c78c0)
![Rspack](https://img.shields.io/badge/Rspack-Supported-0f172a?logo=rspack&logoColor=white)

ESBoot is a frontend engineering toolkit for React and Vue teams that want a
single workflow across Vite, Webpack, and Rspack.

It gives you a unified config layer, built-in conventions, a plugin system, and
example apps that double as integration fixtures. The goal is to keep app
development fast and familiar while still leaving room for deep bundler
customization when you need it.

Official website: <https://esboot.js.org>

[Get Started](#quick-start) · [Examples](#example-projects) · [Docs](https://esboot.js.org/docs) · [Website](https://esboot.js.org)

## Why ESBoot

- One config surface for SP and MP applications
- Multiple bundler adapters with a shared mental model
- Built-in styling support for CSS Modules, Tailwind CSS, px2rem, and `styleName`
- Plugin hooks for commands, config generation, lint presets, and project prep
- Example apps that stay close to real-world usage
- Path-safe behavior across macOS, Linux, and Windows

## Highlights

### Bundler Flexibility

ESBoot can target different toolchains without forcing you to rewrite your app
conventions.

- Vite for fast development and modern builds
- Webpack for existing ecosystem compatibility
- Rspack for teams that want a Rust-based alternative

### Unified Project Model

The same app shape works across the supported bundlers, so the mental model
stays stable even when the implementation changes.

- Consistent entry discovery
- Shared config defaults and environment loading
- SP and MP path derivation from the same config layer
- Example apps that exercise the actual build pipeline

### Styling

ESBoot includes the pieces most teams end up wiring together by hand:

- Tailwind CSS support for both legacy and modern flows
- CSS Modules with consistent class name generation
- Automatic `styleName` support for React
- Global style handling for SP and MP apps
- Optional `px2rem` processing for mobile-oriented projects

### Project Workflow

ESBoot is more than a bundler wrapper. It also helps with the surrounding
project workflow:

- `prepare` generates editor and linting support files
- Plugins can customize config, commands, and generated outputs
- The CLI loads environment files and derives SP / MP paths automatically
- Example apps are treated as part of the compatibility surface

### Developer Experience

The repo is tuned for iterative development:

- Strong defaults for TypeScript, linting, and formatting
- Example builds that act as integration checks
- Focused package commands for bundler-specific work
- Windows-friendly path handling for cross-platform teams

## Common Scenarios

- Start a new React app with Vite, but keep the option to switch bundlers later
- Maintain an existing SP or MP codebase with shared defaults and rules
- Build a React admin dashboard with Tailwind, CSS Modules, and code splitting
- Add a Vue sample without introducing a second unrelated toolchain
- Extend project behavior through plugins instead of ad hoc scripts

## Example Projects

The examples are executable reference points, not throwaway demos.

- `examples/react-admin`: Vite React admin sample with a larger app structure
- `examples/sp-base`: React single-platform sample that can switch bundlers
- `examples/mp-base`: React multi-platform sample with platform/page-type switching
- `examples/sp-base-vue`: Vite Vue sample using the Vue plugin

If you want to see ESBoot in a more realistic app, start here:

- `examples/react-admin` for a larger Vite app with production-style patterns
- `examples/sp-base` for bundler comparisons on the same React app
- `examples/mp-base` for platform-specific routing and content selection
- `examples/sp-base-vue` for Vue plugin integration

Useful example commands:

```bash
cd examples/react-admin && pnpm run dev
cd examples/react-admin && pnpm run build
```

```bash
cd examples/sp-base && pnpm run dev:vite
cd examples/sp-base && pnpm run build:vite
cd examples/sp-base && pnpm run build:webpack
cd examples/sp-base && pnpm run build:rspack
```

```bash
cd examples/mp-base && pnpm run dev:vite
cd examples/mp-base && pnpm run build:vite
cd examples/mp-base && pnpm run build:webpack
cd examples/mp-base && pnpm run build:rspack
```

## Quick Start

```bash
pnpm install
pnpm run dev
```

```bash
pnpm run build
pnpm run test
```

If you only want one bundler while developing core packages:

```bash
pnpm run dev:vite
pnpm run dev:webpack
pnpm run dev:rspack
```

For example apps:

```bash
cd examples/react-admin && pnpm run dev
cd examples/react-admin && pnpm run build
```

```bash
cd examples/sp-base && pnpm run dev
cd examples/sp-base && pnpm run build:vite
```

## Development Commands

- `pnpm run lint`: ESLint over `packages/**/src/**/*.ts`
- `pnpm run test`: Vitest root runner
- `pnpm run test:examples`: example-level tests
- `pnpm run format`: Prettier over Markdown and TypeScript
- `pnpm run build`: full Turbo build

When changing user-facing behavior, prefer a focused package test plus the
relevant example build so regressions show up early.

## Documentation

The website contains the full docs, guides, and API reference:

- Home: <https://esboot.js.org>
- Docs: <https://esboot.js.org/docs>

If you need configuration details, environment variables, styling behavior, or
plugin APIs, the website is the best place to start.

Useful doc starting points:

- Styling: https://esboot.js.org/docs/development/css
- Environment variables: https://esboot.js.org/docs/development/environment-variables
- Plugin API: https://esboot.js.org/docs/api/plugin
- Browser utilities: https://esboot.js.org/docs/api/browser-react

## Contributing

Changes that affect config, bundler behavior, or styling should be backed by:

- a focused unit or integration test in the relevant package
- at least one example build when user-facing output is involved

Keep SP and MP behavior distinct where the config says they differ, and verify
Windows behavior when working on path-sensitive code.

