"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[127],{7522:(e,n,t)=>{t.d(n,{Zo:()=>c,kt:()=>b});var i=t(9901);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function r(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);n&&(i=i.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,i)}return t}function s(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?r(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):r(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function a(e,n){if(null==e)return{};var t,i,o=function(e,n){if(null==e)return{};var t,i,o={},r=Object.keys(e);for(i=0;i<r.length;i++)t=r[i],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(i=0;i<r.length;i++)t=r[i],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var l=i.createContext({}),d=function(e){var n=i.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):s(s({},n),e)),t},c=function(e){var n=d(e.components);return i.createElement(l.Provider,{value:n},e.children)},p="mdxType",u={inlineCode:"code",wrapper:function(e){var n=e.children;return i.createElement(i.Fragment,{},n)}},m=i.forwardRef((function(e,n){var t=e.components,o=e.mdxType,r=e.originalType,l=e.parentName,c=a(e,["components","mdxType","originalType","parentName"]),p=d(t),m=o,b=p["".concat(l,".").concat(m)]||p[m]||u[m]||r;return t?i.createElement(b,s(s({ref:n},c),{},{components:t})):i.createElement(b,s({ref:n},c))}));function b(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var r=t.length,s=new Array(r);s[0]=m;var a={};for(var l in n)hasOwnProperty.call(n,l)&&(a[l]=n[l]);a.originalType=e,a[p]="string"==typeof e?e:o,s[1]=a;for(var d=2;d<r;d++)s[d]=t[d];return i.createElement.apply(null,s)}return i.createElement.apply(null,t)}m.displayName="MDXCreateElement"},6378:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>s,default:()=>u,frontMatter:()=>r,metadata:()=>a,toc:()=>d});var i=t(4749),o=(t(9901),t(7522));const r={sidebar_position:2},s="\u547d\u4ee4\u884c",a={unversionedId:"guides/command",id:"guides/command",title:"\u547d\u4ee4\u884c",description:"\u8981\u83b7\u53d6\u53ef\u7528\u7684\u547d\u4ee4\u5217\u8868\uff0c\u4f60\u53ef\u4ee5\u5728\u9879\u76ee\u76ee\u5f55\u4e2d\u8fd0\u884c help \u547d\u4ee4\uff1a",source:"@site/docs/guides/command.md",sourceDirName:"guides",slug:"/guides/command",permalink:"/docs/guides/command",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/guides/command.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"\u76ee\u5f55\u7ed3\u6784",permalink:"/docs/guides/menu"},next:{title:"\u914d\u7f6e",permalink:"/docs/guides/config"}},l={},d=[{value:"dev",id:"dev",level:2},{value:"build",id:"build",level:2},{value:"preview",id:"preview",level:2},{value:"lint",id:"lint",level:2},{value:"docs",id:"docs",level:2},{value:"dev",id:"dev-1",level:3},{value:"build",id:"build-1",level:3},{value:"exec",id:"exec",level:2},{value:"mock:bridge",id:"mockbridge",level:2},{value:"g-alias",id:"g-alias",level:2}],c={toc:d},p="wrapper";function u(e){let{components:n,...t}=e;return(0,o.kt)(p,(0,i.Z)({},c,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"\u547d\u4ee4\u884c"},"\u547d\u4ee4\u884c"),(0,o.kt)("p",null,"\u8981\u83b7\u53d6\u53ef\u7528\u7684\u547d\u4ee4\u5217\u8868\uff0c\u4f60\u53ef\u4ee5\u5728\u9879\u76ee\u76ee\u5f55\u4e2d\u8fd0\u884c help \u547d\u4ee4\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"$ esboot help\n\n# \u4f60\u5e94\u8be5\u80fd\u770b\u5230\u7c7b\u4f3c\u5982\u4e0b\u7684\u65e5\u5fd7\uff1a\n\nUsage: esboot [options] [command]\n\nOptions:\n  -V, --version          output the version number\n  -h, --help             display help for command\n\nCommands:\n  dev                    Start development project\n  build                  build project\n  preview [options]      Preview Projects\n  lint                   Lint files\n  docs                   docs\n  exec                   exec commands\n  mock:bridge [options]  Start bridge mock\n  help [command]         display help for command\n")),(0,o.kt)("p",null,"\u5982\u4f55\u8fd8\u60f3\u67e5\u770b\u5177\u4f53\u547d\u4ee4\u7684\u914d\u7f6e\uff0c\u53ef\u4ee5\u7ee7\u7eed\u6267\u884c"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"$ esboot help preview\n\nUsage: esboot preview [options]\n\nPreview Projects\n\nOptions:\n  -p, --port <char>\n  -d, --directory <char>\n  -h, --help              display help for command\n")),(0,o.kt)("h2",{id:"dev"},"dev"),(0,o.kt)("p",null,"\u542f\u52a8\u672c\u5730\u5f00\u53d1\u670d\u52a1\u5668\uff0c\u8fdb\u884c\u9879\u76ee\u7684\u5f00\u53d1\u4e0e\u8c03\u8bd5\u3002"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"$ esboot dev\n...\n")),(0,o.kt)("h2",{id:"build"},"build"),(0,o.kt)("p",null,"\u6784\u5efa\u9879\u76ee\uff0c\u9002\u7528\u4e8e\u751f\u4ea7\u73af\u5883\u7684\u90e8\u7f72\u3002"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"$ esboot build\n...\n")),(0,o.kt)("h2",{id:"preview"},"preview"),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"preview"),"\u547d\u4ee4\u4f1a\u5728\u672c\u5730\u542f\u52a8\u4e00\u4e2a\u9759\u6001 Web \u670d\u52a1\u5668\uff0c\u5c06 dist \u6587\u4ef6\u5939\u8fd0\u884c\u5728 ",(0,o.kt)("inlineCode",{parentName:"p"},"http://127.0.0.1:8900"),", \u7528\u4e8e\u9884\u89c8\u6784\u5efa\u540e\u4ea7\u7269\u3002"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"$ esboot preview\n\nStarting up http-server, serving dist\n\nhttp-server version: 14.1.1\n\nhttp-server settings: \nCORS: disabled\nCache: 1 seconds\nConnection Timeout: 120 seconds\nDirectory Listings: visible\nAutoIndex: visible\nServe GZIP Files: false\nServe Brotli Files: false\nDefault File Extension: none\n\nAvailable on:\n  http://127.0.0.1:8900\n  http://10.10.11.247:8900\n  http://198.18.0.1:8900\n")),(0,o.kt)("h2",{id:"lint"},"lint"),(0,o.kt)("p",null,"lint\u547d\u4ee4\u7528\u4e8e\u68c0\u67e5\u53ca\u4fee\u6b63\u4ee3\u7801\u662f\u5426\u7b26\u5408\u89c4\u5219\u3002\u76ee\u524d\u5305\u542b\u4e86eslint\u6821\u9a8c\u548cstylelint\u6821\u9a8c\u3002"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"$ esboot lint\n...\n")),(0,o.kt)("h2",{id:"docs"},"docs"),(0,o.kt)("p",null,"\u542f\u52a8\u9879\u76ee\u6587\u6863\uff0c\u57fa\u4e8e",(0,o.kt)("inlineCode",{parentName:"p"},"docs"),"\u76ee\u5f55\uff0c\u652f\u6301MDX\u3002"),(0,o.kt)("h3",{id:"dev-1"},"dev"),(0,o.kt)("p",null,"\u542f\u52a8dev\u670d\u52a1\u5668\u3002"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"$ esboot docs dev\n\ninfo  - dumi v2.2.1\nwarn  - Hash history is temporarily incompatible, it is recommended to use browser history for now.\ninfo  - Umi v4.0.71\n        \u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557\n        \u2551 App listening at:                                  \u2551\n        \u2551  >   Local: http://localhost:8001                  \u2551\nready - \u2551  > Network: http://10.10.11.247:8001               \u2551\n        \u2551                                                    \u2551\n        \u2551 Now you can open browser with the above addresses\u2191 \u2551\n        \u255a\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255d\nevent - [Webpack] Compiled in 5467 ms (1394 modules)\n")),(0,o.kt)("h3",{id:"build-1"},"build"),(0,o.kt)("p",null,"\u6253\u5305\u6587\u6863\uff0c\u7528\u4e8e\u90e8\u7f72\u7ebf\u4e0a\u6587\u6863\u3002"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"$ esboot docs build\n\ninfo  - dumi v2.2.1\nwarn  - Hash history is temporarily incompatible, it is recommended to use browser history for now.\ninfo  - Umi v4.0.71\n\n\u2714 Webpack\n  Compiled successfully in 4.60s\n\ninfo  - Memory Usage: 323.54 MB (RSS: 630.59 MB)\n\ninfo  - File sizes after gzip:\n\n  237.73 kB  dist/umi.78ec1200.js\n  39 kB      dist/927.1de87c66.chunk.css\n  27.52 kB   dist/927.7ccf385d.async.js\n  22.41 kB   dist/85.ca55c792.async.js\n  4.12 kB    dist/umi.6cab289a.css\n  1.19 kB    dist/docs__hello__index.md.778c6473.chunk.css\n  1.19 kB    dist/docs__index.md.778c6473.chunk.css\n  717 B      dist/dumi__theme__ContextWrapper.5c098201.async.js\n  404 B      dist/dumi__theme__ContextWrapper.92e58cdd.chunk.css\n  351 B      dist/docs__hello__index.md.8cb70dc6.async.js\n  339 B      dist/dumi__theme__layouts__DocLayout.00dacd40.async.js\n  319 B      dist/dumi__pages__404.ef2ba46c.async.js\n  276 B      dist/dumi__pages__404.8b85f2d9.chunk.css\n  266 B      dist/docs__index.md.a521bf97.async.js\n  244 B      dist/dumi__pages__Demo.2b46b679.async.js\n  147 B      dist/957.2b2e8583.async.js\n  45 B       dist/dumi__pages__Demo.578aa5c0.chunk.css\n\nevent - Build 404.html\nevent - Build hello/index.html\nevent - Build index.html\nevent - Build ~demos/:id/index.html\nevent - Build ~demos/docs-hello-demo-0/index.html\n")),(0,o.kt)("h2",{id:"exec"},"exec"),(0,o.kt)("p",null,"\u7528\u4e8e\u6267\u884cesboot\u5185\u90e8\u7684\u547d\u4ee4\uff0c\u5bf9\u5916\u53ef\u4ee5\u4e0d\u4f7f\u7528\u3002"),(0,o.kt)("h2",{id:"mockbridge"},"mock:bridge"),(0,o.kt)("p",null,"\u7528\u4e8e\u914d\u5408",(0,o.kt)("inlineCode",{parentName:"p"},"bridge-mock"),"\uff0c\u542f\u52a8mock\u670d\u52a1\u3002"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"$ esboot mock:bridge\n\n/Users/My/esboot-react-mp/config/mobile/bridge/bridge-mock.js \u52a0\u8f7d\u6210\u529f\n\u6b63\u5728\u76d1\u542c *:3002, admin\u63a7\u5236\u53f0\u8bbf\u95ee\u5730\u5740\uff1a http://localhost:3002?port=3002\n")),(0,o.kt)("h2",{id:"g-alias"},"g-alias"),(0,o.kt)("p",null,"\u7528\u4e8e\u6539\u4e86",(0,o.kt)("a",{parentName:"p",href:"/docs/guides/config#alias"},"alias"),"\u4e4b\u540e\u4ece\u65b0\u751f\u6210",(0,o.kt)("inlineCode",{parentName:"p"},"typescript"),"\u548c",(0,o.kt)("inlineCode",{parentName:"p"},"eslint"),"\u7684\u914d\u7f6e\u3002"))}u.isMDXComponent=!0}}]);