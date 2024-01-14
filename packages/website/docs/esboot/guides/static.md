---
sidebar_position: 4
---

# Static

## 自定义静态文件

静态文件不需要额外的配置，esboot会自动去根目录的`config`目录下去找。以`esboot.txt`文件来说，规则如下：

1. 当放在`config/static/esboot.txt`的时候，此时无论什么平台打包，都会生成到`dist/static/esboot.ext`中去。
2. 当放在`config/mobile/static/esboot.txt`的时候，只有当`ESBOOT_PLATFORM=mobile`的时候才会生效，生成到`dist/static/esboot.ext`中去。`config/pc/static/esboot.txt`和`ESBOOT_PLATFORM=pc`的时候同理。
3. 当放在`config/mobile/browser/static/esboot.txt`的时候，只有当`ESBOOT_PLATFORM=mobile和ESBOOT_PAGE_TYPE=browser`的时候才会生效，生成到`dist/static/esboot.ext`中去，其他平台同理。

上述的三条规则可以叠加，当同时存在的时候，指定更详细的会覆盖外面的，3 > 2 > 1。

## config.js

`config.js`在`config`目录的每个平台下，比如`config/mobile/browser/config.js`，是用来做项目运行时配置使用的，所以会自动找到对应的平台下面的`config`生成到`dist/config.js`中。
