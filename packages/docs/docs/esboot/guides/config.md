---
sidebar_position: 3
---

# 配置

对于`esboot`中能使用的自定义配置，你可以使用项目根目录的`.esbootrc.ts`。

`esboot`的配置文件是一个正常的 node 模块，它在执行`esboot`命令行的时候使用，并且不包含在浏览器端构建中。

这里有一个最简单的`esboot`配置文件的范例：

```ts
import { defineConfig } from 'esboot';
 
export default defineConfig({
  outputPath: 'dist',
});
```

使用 `defineConfig` 包裹配置是为了在书写配置文件的时候，能得到更好的拼写联想支持。如果你不需要，直接 `export default {}` 也可以。

## analyze

- 类型：`boolean`
- 默认值：`false`

产物size分析，基于[webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)。

## alias

- 类型：`Record<string, string>`
- 默认值：

```js
{
  '@': 'src',
  '@mobile': 'src/platforms/mobile',
  '@mobile-native': 'src/platforms/mobile/_native',
  '@mobile-browser': 'src/platforms/mobile/_browser',
  '@pc': 'src/platforms/pc',
  '@pc-native': 'src/platforms/pc/_native',
  '@pc-browser': 'src/platforms/pc/_browser',
}
```

路径别名配置，使用方法如：

```tsx
import { FONT_SIZE } from '@/constants/config';
```

:::tip

配置的key，如`@`，不要写成`@/`，value如`src`，不要写成`src/`，因为解析的时候会自动加上。

因为`alias`在项目中其实需要配置4个地方(`eslint`/`typescript`/`webpack`/`babel`)，4个地方的写法都有些不同，所以`esboot`内部会去兼容格式问题。其中`webpack`和`babel`的改了`alias`会立即生效。`typescript`的会在执行`esboot g-alias`后生效。但是`eslint`只会在开项目的时候读一次配置，所以改了`alias`之后最好的操作就是先执行`esboot g-alias`，然后`reload window`(`vscode`中触发快捷键`ctrl + shift + p`，然后输入`reload window`)一下。这样`alias`才会完全生效。
:::

## define

- 类型：`Record<string, string>`
- 默认值： 如下

```js
{
  'process.env.VERSION': JSON.stringify(version),
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
}
```

基于[define-plugin](https://webpack.js.org/plugins/define-plugin/) 插件设置代码中的可用变量。

:::caution

- 属性值会经过一次 `JSON.stringify` 转换。
- key 值的替换是通过语法形式来匹配的，比如配置了 `{'a.b.c': 'abcValue'}` 是无法替换代码中的 `a.b?.c` 的

:::

当你在 ts 的项目中使用这些变量时，你需要在 `globals.d.ts` 文件中声明变量类型，以支持 ts 类型提示，比如：

```js
// define
declare const define: string;
```

## mfsu

- 类型：`boolean`
- 默认值：`true`

是否开启[mfsu](https://module-federation.github.io/)

## copy

**大部分情况可以不用，参考[static](/docs/esboot/guides/static)**

- 类型：`Array<string | { from: string; to: string; }>`
- 默认值：`[]`

配置要复制到输出目录的文件或文件夹。

当配置字符串时，默认拷贝到产物目录，如：

```ts
copy: ['foo.json', 'src/bar.json']
```

会产生如下产物的结构：

```txt
+ dist
  - bar.json
  - foo.json
+ src
  - bar.json
- foo.json
```

你也可以通过对象配置具体的拷贝位置，其中相对路径的起点为项目根目录：

```ts
copy: [
  { from: 'from', to: 'dist/output' },
  { from: 'file.json', to: 'dist' }
]
```

此时将产生如下产物结构：

```txt
+ dist
  + output
    - foo.json
  - file.json
+ from
  - foo.json
- file.json
```

## codeSplitting

`v2.5.0`

参考[codesplitting](https://umijs.org/docs/esboot/api/config#codesplitting)，配置完全相同，除了`jsStrategyOptions`。

在`granularChunks`模式下：

```ts
interface JsStrategyOptions {
  // 加入此数组中的库，才会被打包到公共的依赖中。
  frameworkBundles: string[];
}

// frameworkBundles的默认值为
 const FRAMEWORK_BUNDLES = [
      // React Series
      'react-dom',
      'react',
      'react-intl',
      'react-router',
      'react-router-dom',
      'classnames',
      //
      'lodash',
      'dayjs',
      'zustand',
      '@loadable/component',
    ];
```

## proxy

- 类型：`object`
- 默认值：`{}`

配置代理功能，参考[devServer.proxy](https://webpack.js.org/configuration/dev-server/#devserverproxy)。

比如，

```ts
proxy: {
  '/api': {
    'target': 'http://jsonplaceholder.typicode.com/',
    'changeOrigin': true,
    'pathRewrite': { '^/api' : '' },
  }
}
```

注意：`proxy` 功能仅在 `dev` 时有效。

## https

- 默认值：`false`

与[devServer.https](https://webpack.js.org/configuration/dev-server/#devserverhttps)一致。

## http2

- 默认值：`false`

与[devServer.http2](https://webpack.js.org/configuration/dev-server/#devserverhttp2)一致。

## open

- 默认值：`false`

与[devServer.open](https://webpack.js.org/configuration/dev-server/#devserveropen)一致。

## port

- 默认值：`8900`

与[devServer.port](https://webpack.js.org/configuration/dev-server/#devserverport)一致。

## svgr

- 类型：`boolean`
- 默认值：`true`

开启[svgr](https://react-svgr.com/docs/esboot/webpack/)之后可以写成

```tsx
import svg from './assets/file.svg?url'
import Svg from './assets/file.svg'

const App = () => {
  return (
    <div>
      <img src={svg} width="200" height="200" />
      <Svg width="200" height="200" viewBox="0 0 3500 3500" />
    </div>
  )
}
```

## svgrOptions

- 默认值: 

```ts
{
  icon: true,
  typescript: true,
  ext: 'tsx',
}
```

参考[svgrOptions](https://react-svgr.com/docs/esboot/options/)

## TSChecker

- 类型：`boolean`
- 默认值：`false`

开启 `TypeScript` 的类型检查。基于[fork-ts-checker-webpack-plugin](https://github.com/TypeStrong/fork-ts-checker-webpack-plugin)。

## outputPath

- 默认值：`dist`

与[output.path](https://webpack.js.org/configuration/output/#outputpath)一致。

注意：执行`esboot preview`的时候也会默认用这个路径。

## extraBabelPlugins

- 类型：`string[] | Function`
- 默认值：`[]`

配置额外的 babel 插件。可传入插件地址或插件函数。

## extraBabelPresets

- 类型：`string[] | Function`
- 默认值：`[]`

配置额外的 babel 插件集。可传入插件集地址或插件集函数。

## extraBabelIncludes

- 类型：`Array<string | RegExp>`
- 默认值：`[]`

配置额外需要做 Babel 编译的 NPM 包或目录。常用于处理第三方库的兼容性。

## pxtorem

- 默认值：

```js
{
  // 如果是mobile 默认为true
  enable: false,
  rootValue: 100,
  unitPrecision: 5,
  propWhiteList: [],
  propBlackList: [],
  exclude: false,
  selectorBlackList: [],
  ignoreIdentifier: false,
  replace: true,
  mediaQuery: false,
  minPixelValue: 0,
}
```

参考[postcss-plugin-px2rem](https://www.npmjs.com/package/postcss-plugin-px2rem)。只不过内置的是基于postcss的插件。

## jsMinifier

- 类型：`JsMinifier`。

```ts
enum JsMinifier {
  terser = 'terser',
  // esbuild = 'esbuild',
  swc = 'swc',
  none = 'none', // 不压缩
}
```

- 默认值：`JsMinifier.terser`

## jsMinifierOptions

- 类型：`object`
- 默认值：`{}`

`jsMinifier` 的配置项；默认情况下压缩代码会移除代码中的注释，可以通过对应的 `jsMinifier` 选项来保留注释。

示例:

```ts
{
  jsMinifier: 'terser',
  jsMinifierOptions: {
    format: {
      comments: false,
    },
  }
}
```

配置项需要和所使用的工具对应，具体参考对应文档：

- [terser](https://terser.org/docs/esboot/api-reference/#minify-options)
- [swc](https://swc.rs/docs/esboot/configuration/minification#configuration)

## cssMinifier

- 类型：`CSSMinifier`

```ts
export enum CSSMinifier {
  cssnano = 'cssnano',
  lightningcss = 'lightningcss',
  none = 'none', // 不压缩
}
```

- 默认值：`CSSMinifier.cssnano`

## cssMinifierOptions

- 类型： `Object`
- 默认值：`{}`

`cssMinifier` CSS 压缩工具配置选项。

示例：

```css
{
  cssMinifier: 'lightningcss',
  cssMinifierOptions: {},
}
```

对应 CSS 压缩的配置请查看对应的文档。

- [cssnano](https://cssnano.co/docs/esboot/config-file/)
- [lightningcss](https://lightningcss.dev/)
