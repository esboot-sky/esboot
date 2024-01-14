---
sidebar_position: 0
---

## 使用插件

```ts
// .esbootrc.ts
import vitestPlugin from '@dz-web/esboot-plugin-vitest';

export default defineConfig({
  // ...
  plugins: [vitestPlugin()],
});
```

## 启动插件

```sh
pnpm run esboot g-alias

pnpm run esboot vitest
```

`vitest`命令转发了[vitest](https://vitest.dev/guide/cli.html)，内置了`-r/-c/--dir`参数，其他参数可以正常加入，如：

```sh
pnpm run esboot vitest --open
```

## 插件说明

插件内部转发了以下依赖，所以无需手动安装。

- [vitest](http://localhost:3000/docs/plugins/plugin-list/vitest)
- [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/)
- [@testing-library/user-event](https://testing-library.com/docs/ecosystem-user-event/)

## 使用示例

```ts
import { test, expect } from 'vitest';
import { render } from '@testing-library/react';

import Home from '@/modules/demo/app';

test('Demo', () => {
  const { container } = render(<Home />);

  expect(container.querySelector('p')?.textContent).toBe('close');
});
```
