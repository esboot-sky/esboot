"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[204],{4024:(e,t,r)=>{r.d(t,{Zo:()=>u,kt:()=>m});var o=r(1169);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function s(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,o)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?s(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):s(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,o,n=function(e,t){if(null==e)return{};var r,o,n={},s=Object.keys(e);for(o=0;o<s.length;o++)r=s[o],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(o=0;o<s.length;o++)r=s[o],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var c=o.createContext({}),l=function(e){var t=o.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):a(a({},t),e)),r},u=function(e){var t=l(e.components);return o.createElement(c.Provider,{value:t},e.children)},p="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},f=o.forwardRef((function(e,t){var r=e.components,n=e.mdxType,s=e.originalType,c=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),p=l(r),f=n,m=p["".concat(c,".").concat(f)]||p[f]||d[f]||s;return r?o.createElement(m,a(a({ref:t},u),{},{components:r})):o.createElement(m,a({ref:t},u))}));function m(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var s=r.length,a=new Array(s);a[0]=f;var i={};for(var c in t)hasOwnProperty.call(t,c)&&(i[c]=t[c]);i.originalType=e,i[p]="string"==typeof e?e:n,a[1]=i;for(var l=2;l<s;l++)a[l]=r[l];return o.createElement.apply(null,a)}return o.createElement.apply(null,r)}f.displayName="MDXCreateElement"},7858:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>c,contentTitle:()=>a,default:()=>d,frontMatter:()=>s,metadata:()=>i,toc:()=>l});var o=r(378),n=(r(1169),r(4024));const s={sidebar_position:3},a="Hooks",i={unversionedId:"esboot/guides/hooks",id:"esboot/guides/hooks",title:"Hooks",description:"afterHooks",source:"@site/docs/esboot/guides/hooks.md",sourceDirName:"esboot/guides",slug:"/esboot/guides/hooks",permalink:"/docs/esboot/guides/hooks",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/esboot/guides/hooks.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"tutorialSidebar",previous:{title:"\u5f00\u53d1",permalink:"/docs/esboot/guides/dev"},next:{title:"static",permalink:"/docs/esboot/guides/static"}},c={},l=[{value:"afterHooks",id:"afterhooks",level:2}],u={toc:l},p="wrapper";function d(e){let{components:t,...r}=e;return(0,n.kt)(p,(0,o.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"hooks"},"Hooks"),(0,n.kt)("h2",{id:"afterhooks"},"afterHooks"),(0,n.kt)("p",null,(0,n.kt)("inlineCode",{parentName:"p"},"2.4.1")),(0,n.kt)("p",null,"\u6267\u884c\u540e\u94a9\u5b50\uff0c\u76ee\u524d\u7684\u4f5c\u7528\u5c31\u662f\u83b7\u53d6\u8fd0\u884c\u65f6\u53d8\u91cf\u3002"),(0,n.kt)("p",null,(0,n.kt)("em",{parentName:"p"},".esbootrc.ts")),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-ts"},"export const afterHooks = (info) => {\n  console.log(info, '<-- info');\n};\n")))}d.isMDXComponent=!0}}]);