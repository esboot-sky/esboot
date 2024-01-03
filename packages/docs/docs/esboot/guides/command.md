---
sidebar_position: 2
---

# 命令行

要获取可用的命令列表，你可以在项目目录中运行 help 命令：

```bash
$ esboot help

# 你应该能看到类似如下的日志：

Usage: esboot [options] [command]

Options:
  -V, --version          output the version number
  -h, --help             display help for command

Commands:
  dev                    Start development project
  build                  build project
  preview [options]      Preview Projects
  lint                   Lint files
  docs                   docs
  exec                   exec commands
  mock:bridge [options]  Start bridge mock
  help [command]         display help for command
```

如何还想查看具体命令的配置，可以继续执行

```bash
$ esboot help preview

Usage: esboot preview [options]

Preview Projects

Options:
  -p, --port <char>
  -d, --directory <char>
  -h, --help              display help for command
```

## dev

启动本地开发服务器，进行项目的开发与调试。

```bash
$ esboot dev
...
```

## build

构建项目，适用于生产环境的部署。

```bash
$ esboot build
...
```

## preview

`preview`命令会在本地启动一个静态 Web 服务器，将 dist 文件夹运行在 `http://127.0.0.1:8900`, 用于预览构建后产物。

```bash
$ esboot preview

Starting up http-server, serving dist

http-server version: 14.1.1

http-server settings: 
CORS: disabled
Cache: 1 seconds
Connection Timeout: 120 seconds
Directory Listings: visible
AutoIndex: visible
Serve GZIP Files: false
Serve Brotli Files: false
Default File Extension: none

Available on:
  http://127.0.0.1:8900
  http://10.10.11.247:8900
  http://198.18.0.1:8900
```

## lint

lint命令用于检查及修正代码是否符合规则。目前包含了eslint校验和stylelint校验。

```bash
$ esboot lint
...
```

## docs

启动项目文档，基于`docs`目录，支持MDX。

### dev

启动dev服务器。

```bash
$ esboot docs dev

info  - dumi v2.2.1
warn  - Hash history is temporarily incompatible, it is recommended to use browser history for now.
info  - Umi v4.0.71
        ╔════════════════════════════════════════════════════╗
        ║ App listening at:                                  ║
        ║  >   Local: http://localhost:8001                  ║
ready - ║  > Network: http://10.10.11.247:8001               ║
        ║                                                    ║
        ║ Now you can open browser with the above addresses↑ ║
        ╚════════════════════════════════════════════════════╝
event - [Webpack] Compiled in 5467 ms (1394 modules)
```

### build

打包文档，用于部署线上文档。

```bash
$ esboot docs build

info  - dumi v2.2.1
warn  - Hash history is temporarily incompatible, it is recommended to use browser history for now.
info  - Umi v4.0.71

✔ Webpack
  Compiled successfully in 4.60s

info  - Memory Usage: 323.54 MB (RSS: 630.59 MB)

info  - File sizes after gzip:

  237.73 kB  dist/umi.78ec1200.js
  39 kB      dist/927.1de87c66.chunk.css
  27.52 kB   dist/927.7ccf385d.async.js
  22.41 kB   dist/85.ca55c792.async.js
  4.12 kB    dist/umi.6cab289a.css
  1.19 kB    dist/docs/esboot__hello__index.md.778c6473.chunk.css
  1.19 kB    dist/docs/esboot__index.md.778c6473.chunk.css
  717 B      dist/dumi__theme__ContextWrapper.5c098201.async.js
  404 B      dist/dumi__theme__ContextWrapper.92e58cdd.chunk.css
  351 B      dist/docs/esboot__hello__index.md.8cb70dc6.async.js
  339 B      dist/dumi__theme__layouts__DocLayout.00dacd40.async.js
  319 B      dist/dumi__pages__404.ef2ba46c.async.js
  276 B      dist/dumi__pages__404.8b85f2d9.chunk.css
  266 B      dist/docs/esboot/esboot__index.md.a521bf97.async.js
  244 B      dist/dumi__pages__Demo.2b46b679.async.js
  147 B      dist/957.2b2e8583.async.js
  45 B       dist/dumi__pages__Demo.578aa5c0.chunk.css

event - Build 404.html
event - Build hello/index.html
event - Build index.html
event - Build ~demos/:id/index.html
event - Build ~demos/docs/esboot/esboot-hello-demo-0/index.html
```

## postinstall

用于执行`postinstall`钩子，内部执行两个命令。

```sh
$ pnpm run postinstall

# esboot exec husky install
info  - Created File: /Users/rocsun/Code/dz-library/esboot/esboot-react-sp/node_modules/.cache/esboot/eslint/index.js.
info  - Created File: /Users/rocsun/Code/dz-library/esboot/esboot-react-sp/node_modules/.cache/esboot/typescript/esboot.d.ts.
info  - Created File: /Users/rocsun/Code/dz-library/esboot/esboot-react-sp/node_modules/.cache/esboot/typescript/tsconfig.json.
Done!

# esboot g-alia
husky - Git hooks installed
```

## exec

用于执行esboot内部的命令，对外可以不使用。

## Mock Series

生成一些应用的mock数据。

### mock\:bridge

配合[bridge-mock](http://asset.web.dz/ld/bridge-mock/#/)，启动mock服务。

```sh
$ esboot mock:bridge

/Users/My/esboot-react-mp/config/mobile/bridge/bridge-mock.js 加载成功
正在监听 *:3002, admin控制台访问地址： http://localhost:3002?port=3002
```

## Generate Series

生成一些模版类的东西。

### g-alias

用于改了[alias](/docs/esboot/guides/config#alias)之后从新生成`typescript`和`eslint`的配置。
