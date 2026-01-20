# 全局样式文件在 Build 模式下不生效问题

**日期**: 2026-01-20  
**问题发现者**: rocsun  
**严重程度**: 🔴 高 - 影响生产环境构建

## 📋 问题描述

在 `generate-page.tsx` 中导入的全局样式文件：

```typescript
import '@pc/styles/index.scss';
```

**表现**：
- ✅ **Dev 模式**：样式正常生效
- ❌ **Build 模式**：样式不生效，构建后的应用缺少全局样式

## 🔍 根本原因分析

### 问题根源

在 Vite 的 `react-style-name` 插件中，存在两个相关但不一致的逻辑：

#### 1. `handle-style-name.ts` (第 28 行)
```typescript
if (!importPath.includes('styles/')) {
  // 只处理不包含 'styles/' 的导入
  // 包含 'styles/' 的被认为是全局样式，跳过处理
}
```

#### 2. `index.ts` 的 `resolveId` 钩子（修改前）
```typescript
resolveId(source: string, importer: string) {
  if (source.endsWith('.scss')) {
    const resolvedPath = path.resolve(path.dirname(importer), source);
    if (filterStyleFiles(resolvedPath)) {
      return `${resolvedPath}?module`;  // 所有 .scss 都添加 ?module
    }
  }
}
```

### 为什么 Dev 模式正常？

Vite 在开发模式下会使用**默认的样式处理流程**，即使插件跳过了某些导入，Vite 的内置样式加载器仍然会处理这些文件。

### 为什么 Build 模式失败？

在生产构建模式下：
1. `resolveId` 钩子会拦截所有 `.scss` 文件的解析
2. 但没有对全局样式文件（包含 `styles/` 的路径）做特殊处理
3. 导致全局样式文件的解析被干扰，最终没有被正确打包

### 设计意图

插件的原始设计意图是：
- **全局样式文件**（路径包含 `styles/`）：不使用 CSS Modules，作为普通样式文件处理
- **组件样式文件**（路径不包含 `styles/`）：使用 CSS Modules，添加 `?module` 参数

但 `resolveId` 钩子没有正确实现这个意图。

## ✅ 解决方案

### 第一步：修复 Vite 插件逻辑

在 `resolveId` 钩子中添加全局样式文件的检查：

```typescript
resolveId(source: string, importer: string | undefined) {
  if (source.endsWith('.scss') && importer) {
    const resolvedPath = path.resolve(path.dirname(importer), source);
    
    // 如果是全局样式文件，返回 null，让 Vite 使用默认解析逻辑
    if (isGlobalStyleFile(resolvedPath, globalScssPathList)) {
      return null;
    }
    
    // 组件样式文件添加 ?module 参数
    if (filterStyleFiles(resolvedPath)) {
      const hasQuery = resolvedPath.includes('?');
      return `${resolvedPath}${hasQuery ? '&module' : '?module'}`;
    }
  }
}
```

### 第二步：提取公共逻辑

为了保持 Webpack 和 Vite 的一致性，创建了公共模块：

**文件**: `packages/bundler-common/src/helpers/global-style.ts`

```typescript
/**
 * 获取全局样式文件路径列表
 * 与 Webpack 和 Vite 共享的逻辑
 */
export function getGlobalScssPathList(rootPath: string, isSP: boolean): string[] {
  const globalScssPathList = [path.join(rootPath, './styles/')];
  
  if (!isSP) {
    globalScssPathList.push(
      path.join(rootPath, './platforms/mobile/styles/'),
      path.join(rootPath, './platforms/pc/styles/'),
    );
  }
  
  return globalScssPathList;
}

/**
 * 检查文件路径是否是全局样式文件
 */
export function isGlobalStyleFile(filePath: string, globalScssPathList: string[]): boolean {
  return globalScssPathList.some(globalPath => filePath.includes(globalPath));
}
```

### 第三步：统一 Webpack 和 Vite 的实现

**Vite** (`bundler-vite/src/plugins/react-style-name/index.ts`):
```typescript
import { getGlobalScssPathList, isGlobalStyleFile } from '@dz-web/esboot-bundler-common';

export default function reactStyleNamePlugin(options: Options = {}): Plugin[] {
  const { reactVariableName = 'React', rootPath = '', isSP = false } = options;
  
  // 使用公共的全局样式路径判断逻辑
  const globalScssPathList = getGlobalScssPathList(rootPath, isSP);
  
  // ... 在 resolveId 中使用 isGlobalStyleFile
}
```

**Webpack** (`bundler-webpack/src/cfg/rules/style/add-rules-style.ts`):
```typescript
import { getGlobalScssPathList } from '@dz-web/esboot-bundler-common';

export const addStyleRules: AddFunc = async (cfg, webpackCfg) => {
  const { isDev, isSP, sourceMap, publicPath, rootPath } = cfg.config;
  
  // 使用公共的全局样式路径判断逻辑
  const globalScssPathList = getGlobalScssPathList(rootPath, isSP);
  
  // ... 在 oneOf 规则中使用
}
```

## 📊 全局样式路径规则

根据 `isSP` 参数，全局样式路径包括：

| 路径 | SP 模式 | 非 SP 模式 |
|------|---------|-----------|
| `./styles/` | ✅ | ✅ |
| `./platforms/mobile/styles/` | ❌ | ✅ |
| `./platforms/pc/styles/` | ❌ | ✅ |

**示例**：
- `@pc/styles/index.scss` → 解析为 `./platforms/pc/styles/index.scss` → 全局样式
- `./components/Button/styles.scss` → 不包含上述路径 → 组件样式（CSS Modules）

## 🎯 修改文件清单

### 新增文件
- ✅ `packages/bundler-common/src/helpers/global-style.ts`

### 修改文件
- ✅ `packages/bundler-common/src/index.ts` - 添加导出
- ✅ `packages/bundler-vite/src/plugins/react-style-name/index.ts` - 使用公共函数
- ✅ `packages/bundler-vite/src/cfg/partials/add-style/index.ts` - 传递参数
- ✅ `packages/bundler-webpack/src/cfg/rules/style/add-rules-style.ts` - 使用公共函数

## 🧪 验证方法

### 1. 开发模式验证
```bash
pnpm run dev:vite
# 检查全局样式是否生效
```

### 2. 构建模式验证
```bash
pnpm run build:vite
pnpm run preview
# 检查构建后的应用，全局样式应该正常生效
```

### 3. 检查构建产物
查看 `dist/assets/*.css` 文件，确认全局样式已被打包。

## 💡 经验教训

1. **Dev 和 Build 的差异**：不要假设在 dev 模式下工作的代码在 build 模式下也一定工作
2. **插件钩子的副作用**：Vite 插件的 `resolveId` 钩子会影响模块解析，需要谨慎处理
3. **代码复用**：相同的逻辑应该提取到公共模块，避免 Webpack 和 Vite 的实现不一致
4. **返回 null 的重要性**：在 Vite 插件中，返回 `null` 表示"我不处理这个模块，交给下一个插件或默认处理器"

## 🔗 相关资源

- [Vite Plugin API - resolveId](https://vitejs.dev/guide/api-plugin.html#resolveid)
- [Rollup Plugin Hooks - resolveId](https://rollupjs.org/plugin-development/#resolveid)
- [CSS Modules 规范](https://github.com/css-modules/css-modules)

## 📝 备注

这个问题凸显了在构建工具插件开发中，需要同时考虑开发和生产环境的行为差异。通过提取公共逻辑，我们不仅解决了当前问题，还提高了代码的可维护性和一致性。
