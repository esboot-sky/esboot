# Rspack StyleName Plugin

A Rust-based SWC plugin for transforming `styleName` attributes to `className` in JSX, compiled to WebAssembly for optimal performance.

## Features

- ✅ Transforms `styleName` to `className` at compile time
- ✅ Supports CSS Modules with scoped class names
- ✅ Zero runtime overhead
- ✅ Written in Rust, compiled to WASM
- ✅ Compatible with Rspack's `builtin:swc-loader`

## Installation

```bash
pnpm add @dz-web/rspack-plugin-stylename
```

## Usage

Configure in your Rspack configuration:

```javascript
// rspack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(jsx|tsx)$/,
        use: [{
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              experimental: {
                plugins: [
                  [
                    require.resolve('@dz-web/rspack-plugin-stylename/transform.wasm'),
                    {
                      hashPattern: '[name]__[local]___[hash:base64:5]'
                    }
                  ]
                ]
              }
            }
          }
        }]
      }
    ]
  }
};
```

## Example

Input:

```jsx
import styles from './Button.scss';

function Button() {
  return <button styleName="primary large">Click me</button>;
}
```

Output:

```jsx
import styles from './Button.scss';

function Button() {
  return <button className="Button__primary___a1b2c Button__large___d3e4f">Click me</button>;
}
```

## Configuration

### `hashPattern`

Pattern for generating scoped class names. Default: `[name]__[local]___[hash:base64:5]`

Placeholders:
- `[name]` - File name
- `[local]` - Original class name
- `[hash:base64:N]` - Hash of the content (N = length)

## Development

### Building

```bash
pnpm run build
```

This compiles the Rust code to WASM and copies it to `transform.wasm`.

### Requirements

- Rust toolchain with `wasm32-wasi` target
- `cargo` build tool

## License

ISC
