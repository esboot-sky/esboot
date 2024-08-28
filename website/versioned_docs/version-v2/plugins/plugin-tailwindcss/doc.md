---
sidebar_position: 0
---

## 插件说明

在项目中支持[tailwindcss](https://tailwindcss.com/)。

用于使用[shadcn](https://ui.shadcn.com/)一样的组件库，方便定制。

也用于可以直接使用AI(如[v0](https://v0.dev/))生成的代码。

## 使用插件

### 添加插件

`需要esboot@2.11.4及以上`

```ts
// .esbootrc.ts
import tailwindcssPlugin from '@dz-web/esboot-plugin-tailwindcss';

export default defineConfig({
  // ...
  plugins: [tailwindcssPlugin()],
});
```

#### 插件参数

插件可以接收一个函数：

```ts
type CustomTailwindcssPluginOpts = (defaultConfig: Config) => Config;
```

配置参考[Tailwindcss Configuration](https://tailwindcss.com/docs/configuration)

### 添加tailwindcss

在入口样式文件中添加，如在`esboot-react-mp`模版中可以添加在`src/platforms/styles/index.scss`

```scss
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 依赖转发

插件内部转发了以下依赖，所以无需手动安装。

- [tailwindcss](https://www.npmjs.com/package/tailwindcss)

## 使用示例

```tsx
<p className="text-3xl font-bold underline">
  hello world
</p>
```
