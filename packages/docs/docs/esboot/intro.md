---
sidebar_position: 1
---

# 快速开始

## 环境准备

`Node >= v16`

ESBoot集成了很多工程化工具，包括一些Rust和Go的包，非常大，所以包管理工具推荐使用`pnpm`，节省磁盘空间，退而求次之选用`yarn`。

## 创建项目

先找个地方建个空目录。

```bash
$ mkdir myapp && cd myapp
...
```

通过官方工具创建项目(以下模式选一种即可，推荐`pnpm`)，

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="pnpm" label="pnpm" default>

    pnpm dlx create-esboot@latest
  </TabItem>
  <TabItem value="bun" label="bun">

    bunx create-esboot
  </TabItem>
  <TabItem value="npm" label="npm">

    npx create-esboot@latest
  </TabItem>
  <TabItem value="yarn" label="yarn">

    yarn create esboot
  </TabItem>
</Tabs>

<!-- ```bash
# pnpm
pnpm dlx create-esboot@latest

# bun
bunx create-esboot

# npm
npx create-esboot@latest

# yarn
yarn create esboot
``` -->

### 从模版创建项目

```bash
# 从 @dz-web/esboot-electron-template 创建一个 electron 模板

pnpm create esboot --template electron
```

### 参数选项

使用 `create-esboot` 创建项目时，可用的参数如下：

| option | description |
| ------ | ------ |
| `--no-git` | 创建项目，但不初始化 Git |
| `--no-install` | 创建项目，但不自动安装依赖 |

## 启动项目

```bash
pnpm dev
```

## 编辑器准备

以VSCode举例：

因为ESBoot内置了eslint、stylelint规则。所以一定要安装以下插件

### Stylelint

- [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)

stylelint下载之后需要配置一下能支持scss规则.

![stylelint-config](./images/stylelint-config.png)

配置完之后检测一下，找一个scss文件，配置一个0px，查看一下效果。

![stylelint-error](./images/stylelint-error.png)

### ESLint

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

安装完之后不需要额外的配置，直接找一个tsx文件，

### EditorConfig

- [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)

### i18n Ally

如果使用`esboot-react-mp`模版，一定要装这个插件。
