---
sidebar_position: 0
---

# 插件开发

待补充

```ts
import type { Plugin } from '@dz-web/esboot';

export default (): Plugin => {
  return {
    key: 'plugin-vitest',
    registerCommands: (program) => {
      //
    },
  };
};
```
