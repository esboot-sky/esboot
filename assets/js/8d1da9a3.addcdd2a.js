"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[4894],{7522:(e,t,n)=>{n.d(t,{Zo:()=>d,kt:()=>f});var r=n(9901);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var p=r.createContext({}),c=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},d=function(e){var t=c(e.components);return r.createElement(p.Provider,{value:t},e.children)},s="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,p=e.parentName,d=l(e,["components","mdxType","originalType","parentName"]),s=c(n),m=a,f=s["".concat(p,".").concat(m)]||s[m]||u[m]||i;return n?r.createElement(f,o(o({ref:t},d),{},{components:n})):r.createElement(f,o({ref:t},d))}));function f(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=m;var l={};for(var p in t)hasOwnProperty.call(t,p)&&(l[p]=t[p]);l.originalType=e,l[s]="string"==typeof e?e:a,o[1]=l;for(var c=2;c<i;c++)o[c]=n[c];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},2871:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>o,default:()=>u,frontMatter:()=>i,metadata:()=>l,toc:()=>c});var r=n(4749),a=(n(9901),n(7522));const i={sidebar_position:3},o="\u5f00\u53d1",l={unversionedId:"guides/dev",id:"guides/dev",title:"\u5f00\u53d1",description:"\u5165\u53e3\u6587\u4ef6",source:"@site/docs/guides/dev.md",sourceDirName:"guides",slug:"/guides/dev",permalink:"/docs/guides/dev",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/guides/dev.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"tutorialSidebar",previous:{title:"\u914d\u7f6e",permalink:"/docs/guides/config"},next:{title:"Hooks",permalink:"/docs/guides/hooks"}},p={},c=[{value:"\u5165\u53e3\u6587\u4ef6",id:"\u5165\u53e3\u6587\u4ef6",level:2},{value:"\u5339\u914d\u89c4\u5219",id:"\u5339\u914d\u89c4\u5219",level:3},{value:"\u914d\u7f6e",id:"\u914d\u7f6e",level:3},{value:"title",id:"title",level:4},{value:"template",id:"template",level:4}],d={toc:c},s="wrapper";function u(e){let{components:t,...n}=e;return(0,a.kt)(s,(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"\u5f00\u53d1"},"\u5f00\u53d1"),(0,a.kt)("h2",{id:"\u5165\u53e3\u6587\u4ef6"},"\u5165\u53e3\u6587\u4ef6"),(0,a.kt)("h3",{id:"\u5339\u914d\u89c4\u5219"},"\u5339\u914d\u89c4\u5219"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"esboot"),"\u7684\u89c4\u5219\u662f\u5339\u914d\u6307\u5b9a",(0,a.kt)("inlineCode",{parentName:"p"},"platform")," + ",(0,a.kt)("inlineCode",{parentName:"p"},"pageType"),"\u76ee\u5f55\u4e0b\u7684",(0,a.kt)("inlineCode",{parentName:"p"},"*.entry.tsx"),"\u3002"),(0,a.kt)("p",null,"\u4f8b\u5982\u4f60\u7684",(0,a.kt)("inlineCode",{parentName:"p"},"env"),"\u6587\u4ef6\u5982\u4e0b\uff1a"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-sh"},"ESBOOT_PLATFORM=mobile\nESBOOT_PAGE_TYPE=native\n")),(0,a.kt)("p",null,"\u6b64\u65f6\u542f\u52a8",(0,a.kt)("inlineCode",{parentName:"p"},"dev/build"),"\u547d\u4ee4\u4e0b\u7684",(0,a.kt)("inlineCode",{parentName:"p"},"content"),"\u5c31\u662f",(0,a.kt)("inlineCode",{parentName:"p"},"src/platforms/mobile/_native"),"(\u4f60\u4e5f\u53ef\u4ee5\u901a\u8fc7\u8bbe\u7f6e",(0,a.kt)("inlineCode",{parentName:"p"},"ESBOOT_CONTENT_PATH"),"\u548c",(0,a.kt)("inlineCode",{parentName:"p"},"ESBOOT_CONTENT_PATTERN"),"\u81ea\u5b9a\u4e49\u89c4\u5219\uff0c\u66f4\u591a\u53c2\u8003",(0,a.kt)("a",{parentName:"p",href:"/docs/guides/env#esboot_content_path"},"env"),")\uff0c\u7136\u540e\u53bb\u5bfb\u627e\u4e0b\u9762\u6240\u6709\u7684",(0,a.kt)("inlineCode",{parentName:"p"},"*.entry.tsx"),"\u5f53\u505a\u5165\u53e3\u3002"),(0,a.kt)("p",null,"\u4f8b\u5982\u4f60\u6709\u4e00\u4e2a",(0,a.kt)("inlineCode",{parentName:"p"},"home.entry.tsx"),"\uff0c\u90a3\u4e48\u5728\u6d4f\u89c8\u5668\u4e2d\u7684\u5730\u5740\u5c31\u662f",(0,a.kt)("inlineCode",{parentName:"p"},"http://localhost:8001/home.html"),"(\u57df\u540d\u548c\u7aef\u53e3\u662f\u57fa\u4e8e\u4f60\u7684\u914d\u7f6e\u51b3\u5b9a)."),(0,a.kt)("h3",{id:"\u914d\u7f6e"},"\u914d\u7f6e"),(0,a.kt)("p",null,"\u5165\u53e3\u6587\u4ef6\u652f\u6301\u4e00\u4e9b\u914d\u7f6e\uff0c\u5982\u9ed8\u8ba4",(0,a.kt)("inlineCode",{parentName:"p"},"title"),"\u4e4b\u7c7b\u7684\u3002\u5199\u6cd5\u662f\u5728",(0,a.kt)("inlineCode",{parentName:"p"},"*.entry.tsx"),"\u4e2d\u5bfc\u51fa\u4e00\u4e2a\u5bf9\u8c61\uff0c\u5982\uff1a"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},"// \u4f60\u7684React\u4ee3\u7801\n\nexport default {\n  // \u4ee3\u8868\u9875\u9762\u540d\u79f0\u4e3aDEMO\n  title: 'DEMO',\n};\n")),(0,a.kt)("p",null,"\u4e0b\u9762\u662f\u652f\u6301\u7684\u914d\u7f6e\u6e05\u5355\uff1a"),(0,a.kt)("h4",{id:"title"},"title"),(0,a.kt)("p",null,"\u9875\u9762\u6807\u9898\uff0c\u9ed8\u8ba4\u4e3a",(0,a.kt)("inlineCode",{parentName:"p"},"\u6587\u4ef6\u540d\u79f0 | ESboot APP"),"\u3002"),(0,a.kt)("h4",{id:"template"},"template"),(0,a.kt)("p",null,"\u6a21\u7248html\u5730\u5740\uff0c\u9ed8\u8ba4\u5730\u5740\u662f",(0,a.kt)("inlineCode",{parentName:"p"},"config/{platforms}/template/index.html"),"\u3002"),(0,a.kt)("p",null,"\u914d\u7f6e\u4e0d\u662f\u4e00\u4e2a\u5b8c\u6574\u7684\u5730\u5740(\u76ee\u5f55\u662f\u56fa\u5b9a\u6b7b\u7684)\uff0c\u53ea\u9700\u8981\u914d\u7f6e\u9875\u9762\u540d\u79f0\uff0c\u6bd4\u5982",(0,a.kt)("inlineCode",{parentName:"p"},"my-tpl"),"\uff0c\u6b64\u65f6\u7684\u5730\u5740\u5c31\u4f1a\u662f",(0,a.kt)("inlineCode",{parentName:"p"},"config/{platforms}/template/my-tpl.html"),"\u3002"))}u.isMDXComponent=!0}}]);