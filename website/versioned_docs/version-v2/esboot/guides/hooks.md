---
sidebar_position: 3
---

# Hooks

## afterHooks

`2.4.1`

执行后钩子，目前的作用就是获取运行时变量。

*.esbootrc.ts*

```ts
export const afterHooks = (info) => {
  console.log(info, '<-- info');
};
```
