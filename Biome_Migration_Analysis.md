# Biome迁移可行性分析

## 当前ESLint配置分析

### 完全支持迁移到Biome的规则

```javascript
// 这些规则Biome原生支持，可以直接迁移
const biomeSupportedRules = {
  // 基础语法规则
  'no-unused-vars': 'error',
  'no-console': 'warn', 
  'prefer-const': 'error',
  'no-var': 'error',
  
  // TypeScript基础规则
  '@typescript-eslint/no-explicit-any': 'warn',
  '@typescript-eslint/no-unused-vars': 'error',
  
  // React基础规则  
  'react/jsx-uses-react': 'error',
  'react/jsx-uses-vars': 'error',
};
```

### 需要保留ESLint的规则

```javascript
// 这些规则Biome不支持，必须保留ESLint
const eslintOnlyRules = {
  // JSX A11y规则（Biome完全不支持）
  'jsx-a11y/alt-text': 'error',
  'jsx-a11y/anchor-is-valid': 'error', 
  'jsx-a11y/click-events-have-key-events': 'error',
  
  // 复杂的Import规则
  'import/order': ['error', { /* 复杂配置 */ }],
  'import/no-unresolved': 'error',
  
  // React Hooks高级规则
  'react-hooks/exhaustive-deps': 'warn',
  
  // 自定义插件规则
  '@dz-web/esboot/no-cross-platform-imports': 'error',
  '@dz-web/esboot/no-cross-platform-lib-imports': 'error',
};
```

## 推荐的混合配置方案

### 1. Biome配置 (biome.json)

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.2/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "ignoreUnknown": false,
    "ignore": [
      "node_modules",
      "dist", 
      "build",
      "lib",
      ".cache",
      "coverage",
      ".nyc_output",
      "stats.html"
    ]
  },
  "formatter": {
    "enabled": true,
    "formatWithErrors": false,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineEnding": "lf",
    "lineWidth": 120,
    "attributePosition": "auto"
  },
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": {
        "noUnusedVariables": "error",
        "useExhaustiveDependencies": "warn"
      },
      "style": {
        "noVar": "error",
        "useConst": "error",
        "useTemplate": "error"
      },
      "suspicious": {
        "noConsoleLog": "warn",
        "noExplicitAny": "warn"
      }
    }
  },
  "javascript": {
    "formatter": {
      "jsxQuoteStyle": "single",
      "quoteProperties": "asNeeded", 
      "trailingCommas": "all",
      "semicolons": "always",
      "arrowParentheses": "always",
      "bracketSpacing": true,
      "bracketSameLine": false,
      "quoteStyle": "single"
    }
  }
}
```

### 2. 简化的ESLint配置 (eslint.config.js)

```javascript
// 只保留Biome不支持的重要规则
export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'jsx-a11y': jsxA11yPlugin.default,
      'react-hooks': reactHooksPlugin.default,
      'import': importPlugin.default,
      '@dz-web/esboot': esbootPlugin.default,
    },
    rules: {
      // 只保留A11y规则
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/click-events-have-key-events': 'error',
      
      // 只保留复杂的React Hooks规则
      'react-hooks/exhaustive-deps': 'warn',
      
      // 只保留复杂的Import规则
      'import/order': ['error', { /* 您的配置 */ }],
      'import/no-unresolved': 'error',
      
      // 保留自定义插件规则
      '@dz-web/esboot/no-cross-platform-imports': 'error',
      '@dz-web/esboot/no-cross-platform-lib-imports': 'error',
    },
  },
];
```

### 3. 更新package.json脚本

```json
{
  "scripts": {
    "lint": "biome lint . && eslint .",
    "lint:fix": "biome lint --apply . && eslint --fix .",
    "format": "biome format --write .",
    "check": "biome check ."
  }
}
```

## 迁移收益

### 优势
- **性能提升**: Biome比ESLint快10-100倍
- **统一工具**: 代码检查和格式化合二为一
- **更好的错误信息**: Biome提供更清晰的错误报告
- **零配置**: 大部分规则开箱即用

### 保持的功能
- **可访问性检查**: 继续使用jsx-a11y
- **自定义业务规则**: 保留esboot插件
- **复杂导入规则**: 保留import插件的高级功能

## 总结

**建议采用混合方案**:
1. 使用Biome处理80%的基础语法检查和代码格式化
2. 使用ESLint处理20%的特殊需求（A11y、自定义插件等）
3. 这样既能享受Biome的性能优势，又不失去重要的功能

这种方案在保持功能完整性的同时，能显著提升开发体验和构建性能。 