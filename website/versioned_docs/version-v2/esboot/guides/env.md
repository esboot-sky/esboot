---
sidebar_position: 5
---

# ENV

## .env文件

env文件用于设置项目编译时的环境变量，目前支持：

- `.env`: 默认提交Git，用于公用的环境变量。
- `.env.local`: 默认不提交Git，用于自己本地开发时候的环境变量，`.env.local`中的变量会覆盖`.env`中的变量。

## 环境变量

### ESBOOT_PLATFORM

是PC端还是移动端

- 可选值：`pc | mobile`
- 默认值: `pc`

### ESBOOT_PAGE_TYPE

是浏览器端还是嵌入到客户端中。

- 可选值：`browser | native`
- 默认值：`browser`

### ESBOOT_CONTENT_PATH

开发MPA的时候会区分模块，比如说交易、行情、个人中心等。每次全量启动会导致开发体验不好，所以可以在开发的时候设置只读取某个路径下的页面。

- 可选值：路径地址

基于根路径是`./platforms/${ESBOOT_PLATFORM}/${ESBOOT_PAGE_TYPE}`。如果不写默认就是读取这个目录下的全量入口。

例如我们想只跑个人中心模块就可以设置

```env
ESBOOT_CONTENT_PATH=./modules/personal-center
```

### ESBOOT_CONTENT_PATTERN

读取页面地址的正则匹配，默认是`*`，代表匹配`ESBOOT_CONTENT_PATH`下所有的的`*.entry.tsx`。

- 可选值：正则

举例只想跑`trade.html`。

```env
ESBOOT_CONTENT_PATTERN=trade
```

想跑`trade.html`和`trade-setting.html`

```env
ESBOOT_CONTENT_PATTERN=+(trade|trade-setting)
```

### BRIDGE_MOCK_HOST

`可选host，如localhost`

bridge-mock的监听host。

### BRIDGE_MOCK_PORT

`可选端口号，如3021`

bridge-mock的监听端口号。
