"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[2678],{7522:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>k});var r=n(9901);function l(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){l(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,l=function(e,t){if(null==e)return{};var n,r,l={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(l[n]=e[n]);return l}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(l[n]=e[n])}return l}var p=r.createContext({}),u=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},c=function(e){var t=u(e.components);return r.createElement(p.Provider,{value:t},e.children)},s="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,l=e.mdxType,a=e.originalType,p=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),s=u(n),m=l,k=s["".concat(p,".").concat(m)]||s[m]||d[m]||a;return n?r.createElement(k,o(o({ref:t},c),{},{components:n})):r.createElement(k,o({ref:t},c))}));function k(e,t){var n=arguments,l=t&&t.mdxType;if("string"==typeof e||l){var a=n.length,o=new Array(a);o[0]=m;var i={};for(var p in t)hasOwnProperty.call(t,p)&&(i[p]=t[p]);i.originalType=e,i[s]="string"==typeof e?e:l,o[1]=i;for(var u=2;u<a;u++)o[u]=n[u];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},3535:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>o,default:()=>d,frontMatter:()=>a,metadata:()=>i,toc:()=>u});var r=n(4749),l=(n(9901),n(7522));const a={sidebar_position:5},o="env",i={unversionedId:"guides/env",id:"guides/env",title:"env",description:".env\u6587\u4ef6",source:"@site/docs/guides/env.md",sourceDirName:"guides",slug:"/guides/env",permalink:"/docs/guides/env",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/guides/env.md",tags:[],version:"current",sidebarPosition:5,frontMatter:{sidebar_position:5},sidebar:"tutorialSidebar",previous:{title:"static",permalink:"/docs/guides/static"},next:{title:"ChangeLogs",permalink:"/docs/category/changelogs"}},p={},u=[{value:".env\u6587\u4ef6",id:"env\u6587\u4ef6",level:2},{value:"\u73af\u5883\u53d8\u91cf",id:"\u73af\u5883\u53d8\u91cf",level:2},{value:"ESBOOT_PLATFORM",id:"esboot_platform",level:3},{value:"ESBOOT_PAGE_TYPE",id:"esboot_page_type",level:3},{value:"ESBOOT_CONTENT_PATH",id:"esboot_content_path",level:3},{value:"ESBOOT_CONTENT_PATTERN",id:"esboot_content_pattern",level:3},{value:"BRIDGE_MOCK_HOST",id:"bridge_mock_host",level:3},{value:"BRIDGE_MOCK_PORT",id:"bridge_mock_port",level:3}],c={toc:u},s="wrapper";function d(e){let{components:t,...n}=e;return(0,l.kt)(s,(0,r.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("h1",{id:"env"},"env"),(0,l.kt)("h2",{id:"env\u6587\u4ef6"},".env\u6587\u4ef6"),(0,l.kt)("p",null,"env\u6587\u4ef6\u7528\u4e8e\u8bbe\u7f6e\u9879\u76ee\u7f16\u8bd1\u65f6\u7684\u73af\u5883\u53d8\u91cf\uff0c\u76ee\u524d\u652f\u6301\uff1a"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},".env"),": \u9ed8\u8ba4\u63d0\u4ea4Git\uff0c\u7528\u4e8e\u516c\u7528\u7684\u73af\u5883\u53d8\u91cf\u3002"),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},".env.local"),": \u9ed8\u8ba4\u4e0d\u63d0\u4ea4Git\uff0c\u7528\u4e8e\u81ea\u5df1\u672c\u5730\u5f00\u53d1\u65f6\u5019\u7684\u73af\u5883\u53d8\u91cf\uff0c",(0,l.kt)("inlineCode",{parentName:"li"},".env.local"),"\u4e2d\u7684\u53d8\u91cf\u4f1a\u8986\u76d6",(0,l.kt)("inlineCode",{parentName:"li"},".env"),"\u4e2d\u7684\u53d8\u91cf\u3002")),(0,l.kt)("h2",{id:"\u73af\u5883\u53d8\u91cf"},"\u73af\u5883\u53d8\u91cf"),(0,l.kt)("h3",{id:"esboot_platform"},"ESBOOT_PLATFORM"),(0,l.kt)("p",null,"\u662fPC\u7aef\u8fd8\u662f\u79fb\u52a8\u7aef"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\u53ef\u9009\u503c\uff1a",(0,l.kt)("inlineCode",{parentName:"li"},"pc | mobile")),(0,l.kt)("li",{parentName:"ul"},"\u9ed8\u8ba4\u503c: ",(0,l.kt)("inlineCode",{parentName:"li"},"pc"))),(0,l.kt)("h3",{id:"esboot_page_type"},"ESBOOT_PAGE_TYPE"),(0,l.kt)("p",null,"\u662f\u6d4f\u89c8\u5668\u7aef\u8fd8\u662f\u5d4c\u5165\u5230\u5ba2\u6237\u7aef\u4e2d\u3002"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\u53ef\u9009\u503c\uff1a",(0,l.kt)("inlineCode",{parentName:"li"},"browser | native")),(0,l.kt)("li",{parentName:"ul"},"\u9ed8\u8ba4\u503c\uff1a",(0,l.kt)("inlineCode",{parentName:"li"},"browser"))),(0,l.kt)("h3",{id:"esboot_content_path"},"ESBOOT_CONTENT_PATH"),(0,l.kt)("p",null,"\u5f00\u53d1MPA\u7684\u65f6\u5019\u4f1a\u533a\u5206\u6a21\u5757\uff0c\u6bd4\u5982\u8bf4\u4ea4\u6613\u3001\u884c\u60c5\u3001\u4e2a\u4eba\u4e2d\u5fc3\u7b49\u3002\u6bcf\u6b21\u5168\u91cf\u542f\u52a8\u4f1a\u5bfc\u81f4\u5f00\u53d1\u4f53\u9a8c\u4e0d\u597d\uff0c\u6240\u4ee5\u53ef\u4ee5\u5728\u5f00\u53d1\u7684\u65f6\u5019\u8bbe\u7f6e\u53ea\u8bfb\u53d6\u67d0\u4e2a\u8def\u5f84\u4e0b\u7684\u9875\u9762\u3002"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\u53ef\u9009\u503c\uff1a\u8def\u5f84\u5730\u5740")),(0,l.kt)("p",null,"\u57fa\u4e8e\u6839\u8def\u5f84\u662f",(0,l.kt)("inlineCode",{parentName:"p"},"./platforms/${ESBOOT_PLATFORM}/${ESBOOT_PAGE_TYPE}"),"\u3002\u5982\u679c\u4e0d\u5199\u9ed8\u8ba4\u5c31\u662f\u8bfb\u53d6\u8fd9\u4e2a\u76ee\u5f55\u4e0b\u7684\u5168\u91cf\u5165\u53e3\u3002"),(0,l.kt)("p",null,"\u4f8b\u5982\u6211\u4eec\u60f3\u53ea\u8dd1\u4e2a\u4eba\u4e2d\u5fc3\u6a21\u5757\u5c31\u53ef\u4ee5\u8bbe\u7f6e"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-env"},"ESBOOT_CONTENT_PATH=./modules/personal-center\n")),(0,l.kt)("h3",{id:"esboot_content_pattern"},"ESBOOT_CONTENT_PATTERN"),(0,l.kt)("p",null,"\u8bfb\u53d6\u9875\u9762\u5730\u5740\u7684\u6b63\u5219\u5339\u914d\uff0c\u9ed8\u8ba4\u662f",(0,l.kt)("inlineCode",{parentName:"p"},"*"),"\uff0c\u4ee3\u8868\u5339\u914d",(0,l.kt)("inlineCode",{parentName:"p"},"ESBOOT_CONTENT_PATH"),"\u4e0b\u6240\u6709\u7684\u7684",(0,l.kt)("inlineCode",{parentName:"p"},"*.entry.tsx"),"\u3002"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\u53ef\u9009\u503c\uff1a\u6b63\u5219")),(0,l.kt)("p",null,"\u4e3e\u4f8b\u53ea\u60f3\u8dd1",(0,l.kt)("inlineCode",{parentName:"p"},"trade.html"),"\u3002"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-env"},"ESBOOT_CONTENT_PATTERN=trade\n")),(0,l.kt)("p",null,"\u60f3\u8dd1",(0,l.kt)("inlineCode",{parentName:"p"},"trade.html"),"\u548c",(0,l.kt)("inlineCode",{parentName:"p"},"trade-setting.html")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-env"},"ESBOOT_CONTENT_PATTERN=+(trade|trade-setting)\n")),(0,l.kt)("h3",{id:"bridge_mock_host"},"BRIDGE_MOCK_HOST"),(0,l.kt)("p",null,(0,l.kt)("inlineCode",{parentName:"p"},"\u53ef\u9009host\uff0c\u5982localhost")),(0,l.kt)("p",null,"bridge-mock\u7684\u76d1\u542chost\u3002"),(0,l.kt)("h3",{id:"bridge_mock_port"},"BRIDGE_MOCK_PORT"),(0,l.kt)("p",null,(0,l.kt)("inlineCode",{parentName:"p"},"\u53ef\u9009\u7aef\u53e3\u53f7\uff0c\u59823021")),(0,l.kt)("p",null,"bridge-mock\u7684\u76d1\u542c\u7aef\u53e3\u53f7\u3002"))}d.isMDXComponent=!0}}]);