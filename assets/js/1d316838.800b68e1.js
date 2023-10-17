"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[9824],{4024:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>b});var r=n(1169);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},l=Object.keys(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var u=r.createContext({}),s=function(e){var t=r.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},c=function(e){var t=s(e.components);return r.createElement(u.Provider,{value:t},e.children)},p="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,l=e.originalType,u=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),p=s(n),m=a,b=p["".concat(u,".").concat(m)]||p[m]||d[m]||l;return n?r.createElement(b,o(o({ref:t},c),{},{components:n})):r.createElement(b,o({ref:t},c))}));function b(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var l=n.length,o=new Array(l);o[0]=m;var i={};for(var u in t)hasOwnProperty.call(t,u)&&(i[u]=t[u]);i.originalType=e,i[p]="string"==typeof e?e:a,o[1]=i;for(var s=2;s<l;s++)o[s]=n[s];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},2156:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>I,contentTitle:()=>x,default:()=>D,frontMatter:()=>O,metadata:()=>C,toc:()=>S});var r=n(378),a=n(1169),l=n(4024),o=n(2699),i=n(3541),u=n(7e3),s=n(4742),c=n(8213),p=n(8619);function d(e){return function(e){return a.Children.map(e,(e=>{if(!e||(0,a.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}(e).map((e=>{let{props:{value:t,label:n,attributes:r,default:a}}=e;return{value:t,label:n,attributes:r,default:a}}))}function m(e){const{values:t,children:n}=e;return(0,a.useMemo)((()=>{const e=t??d(n);return function(e){const t=(0,c.l)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,n])}function b(e){let{value:t,tabValues:n}=e;return n.some((e=>e.value===t))}function f(e){let{queryString:t=!1,groupId:n}=e;const r=(0,u.k6)(),l=function(e){let{queryString:t=!1,groupId:n}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!n)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return n??null}({queryString:t,groupId:n});return[(0,s._X)(l),(0,a.useCallback)((e=>{if(!l)return;const t=new URLSearchParams(r.location.search);t.set(l,e),r.replace({...r.location,search:t.toString()})}),[l,r])]}function k(e){const{defaultValue:t,queryString:n=!1,groupId:r}=e,l=m(e),[o,i]=(0,a.useState)((()=>function(e){let{defaultValue:t,tabValues:n}=e;if(0===n.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!b({value:t,tabValues:n}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${n.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const r=n.find((e=>e.default))??n[0];if(!r)throw new Error("Unexpected error: 0 tabValues");return r.value}({defaultValue:t,tabValues:l}))),[u,s]=f({queryString:n,groupId:r}),[c,d]=function(e){let{groupId:t}=e;const n=function(e){return e?`docusaurus.tab.${e}`:null}(t),[r,l]=(0,p.Nk)(n);return[r,(0,a.useCallback)((e=>{n&&l.set(e)}),[n,l])]}({groupId:r}),k=(()=>{const e=u??c;return b({value:e,tabValues:l})?e:null})();(0,a.useLayoutEffect)((()=>{k&&i(k)}),[k]);return{selectedValue:o,selectValue:(0,a.useCallback)((e=>{if(!b({value:e,tabValues:l}))throw new Error(`Can't select invalid tab value=${e}`);i(e),s(e),d(e)}),[s,d,l]),tabValues:l}}var v=n(5932);const y={tabList:"tabList_r7De",tabItem:"tabItem_ftIu"};function h(e){let{className:t,block:n,selectedValue:l,selectValue:u,tabValues:s}=e;const c=[],{blockElementScrollPositionUntilNextRender:p}=(0,i.o5)(),d=e=>{const t=e.currentTarget,n=c.indexOf(t),r=s[n].value;r!==l&&(p(t),u(r))},m=e=>{let t=null;switch(e.key){case"Enter":d(e);break;case"ArrowRight":{const n=c.indexOf(e.currentTarget)+1;t=c[n]??c[0];break}case"ArrowLeft":{const n=c.indexOf(e.currentTarget)-1;t=c[n]??c[c.length-1];break}}t?.focus()};return a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":n},t)},s.map((e=>{let{value:t,label:n,attributes:i}=e;return a.createElement("li",(0,r.Z)({role:"tab",tabIndex:l===t?0:-1,"aria-selected":l===t,key:t,ref:e=>c.push(e),onKeyDown:m,onClick:d},i,{className:(0,o.Z)("tabs__item",y.tabItem,i?.className,{"tabs__item--active":l===t})}),n??t)})))}function g(e){let{lazy:t,children:n,selectedValue:r}=e;const l=(Array.isArray(n)?n:[n]).filter(Boolean);if(t){const e=l.find((e=>e.props.value===r));return e?(0,a.cloneElement)(e,{className:"margin-top--md"}):null}return a.createElement("div",{className:"margin-top--md"},l.map(((e,t)=>(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==r}))))}function N(e){const t=k(e);return a.createElement("div",{className:(0,o.Z)("tabs-container",y.tabList)},a.createElement(h,(0,r.Z)({},e,t)),a.createElement(g,(0,r.Z)({},e,t)))}function E(e){const t=(0,v.Z)();return a.createElement(N,(0,r.Z)({key:String(t)},e))}const w={tabItem:"tabItem_ttBO"};function T(e){let{children:t,hidden:n,className:r}=e;return a.createElement("div",{role:"tabpanel",className:(0,o.Z)(w.tabItem,r),hidden:n},t)}const O={sidebar_position:1},x="\u5feb\u901f\u5f00\u59cb",C={unversionedId:"esboot/intro",id:"esboot/intro",title:"\u5feb\u901f\u5f00\u59cb",description:"\u73af\u5883\u51c6\u5907",source:"@site/docs/esboot/intro.md",sourceDirName:"esboot",slug:"/esboot/intro",permalink:"/esboot/docs/esboot/intro",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/esboot/intro.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",next:{title:"Guides",permalink:"/esboot/docs/category/guides"}},I={},S=[{value:"\u73af\u5883\u51c6\u5907",id:"\u73af\u5883\u51c6\u5907",level:2},{value:"\u521b\u5efa\u9879\u76ee",id:"\u521b\u5efa\u9879\u76ee",level:2},{value:"\u4ece\u6a21\u7248\u521b\u5efa\u9879\u76ee",id:"\u4ece\u6a21\u7248\u521b\u5efa\u9879\u76ee",level:3},{value:"\u53c2\u6570\u9009\u9879",id:"\u53c2\u6570\u9009\u9879",level:3},{value:"\u542f\u52a8\u9879\u76ee",id:"\u542f\u52a8\u9879\u76ee",level:2},{value:"\u7f16\u8f91\u5668\u51c6\u5907",id:"\u7f16\u8f91\u5668\u51c6\u5907",level:2},{value:"Stylelint",id:"stylelint",level:3},{value:"ESLint",id:"eslint",level:3},{value:"EditorConfig",id:"editorconfig",level:3}],V={toc:S},j="wrapper";function D(e){let{components:t,...a}=e;return(0,l.kt)(j,(0,r.Z)({},V,a,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("h1",{id:"\u5feb\u901f\u5f00\u59cb"},"\u5feb\u901f\u5f00\u59cb"),(0,l.kt)("h2",{id:"\u73af\u5883\u51c6\u5907"},"\u73af\u5883\u51c6\u5907"),(0,l.kt)("p",null,(0,l.kt)("inlineCode",{parentName:"p"},"Node >= v16")),(0,l.kt)("p",null,"ESBoot\u96c6\u6210\u4e86\u5f88\u591a\u5de5\u7a0b\u5316\u5de5\u5177\uff0c\u5305\u62ec\u4e00\u4e9bRust\u548cGo\u7684\u5305\uff0c\u975e\u5e38\u5927\uff0c\u6240\u4ee5\u5305\u7ba1\u7406\u5de5\u5177\u63a8\u8350\u4f7f\u7528",(0,l.kt)("inlineCode",{parentName:"p"},"pnpm"),"\uff0c\u8282\u7701\u78c1\u76d8\u7a7a\u95f4\uff0c\u9000\u800c\u6c42\u6b21\u4e4b\u9009\u7528",(0,l.kt)("inlineCode",{parentName:"p"},"yarn"),"\u3002"),(0,l.kt)("h2",{id:"\u521b\u5efa\u9879\u76ee"},"\u521b\u5efa\u9879\u76ee"),(0,l.kt)("p",null,"\u5148\u627e\u4e2a\u5730\u65b9\u5efa\u4e2a\u7a7a\u76ee\u5f55\u3002"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"$ mkdir myapp && cd myapp\n...\n")),(0,l.kt)("p",null,"\u901a\u8fc7\u5b98\u65b9\u5de5\u5177\u521b\u5efa\u9879\u76ee(\u4ee5\u4e0b\u6a21\u5f0f\u9009\u4e00\u79cd\u5373\u53ef\uff0c\u63a8\u8350",(0,l.kt)("inlineCode",{parentName:"p"},"pnpm"),")\uff0c"),(0,l.kt)(E,{mdxType:"Tabs"},(0,l.kt)(T,{value:"pnpm",label:"pnpm",default:!0,mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"pnpm dlx create-esboot@latest\n"))),(0,l.kt)(T,{value:"bun",label:"bun",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"bunx create-esboot\n"))),(0,l.kt)(T,{value:"npm",label:"npm",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"npx create-esboot@latest\n"))),(0,l.kt)(T,{value:"yarn",label:"yarn",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"yarn create esboot\n")))),(0,l.kt)("h3",{id:"\u4ece\u6a21\u7248\u521b\u5efa\u9879\u76ee"},"\u4ece\u6a21\u7248\u521b\u5efa\u9879\u76ee"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"# \u4ece @dz-web/esboot-electron-template \u521b\u5efa\u4e00\u4e2a electron \u6a21\u677f\n\npnpm create esboot --template electron\n")),(0,l.kt)("h3",{id:"\u53c2\u6570\u9009\u9879"},"\u53c2\u6570\u9009\u9879"),(0,l.kt)("p",null,"\u4f7f\u7528 ",(0,l.kt)("inlineCode",{parentName:"p"},"create-esboot")," \u521b\u5efa\u9879\u76ee\u65f6\uff0c\u53ef\u7528\u7684\u53c2\u6570\u5982\u4e0b\uff1a"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null},"option"),(0,l.kt)("th",{parentName:"tr",align:null},"description"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"--no-git")),(0,l.kt)("td",{parentName:"tr",align:null},"\u521b\u5efa\u9879\u76ee\uff0c\u4f46\u4e0d\u521d\u59cb\u5316 Git")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"--no-install")),(0,l.kt)("td",{parentName:"tr",align:null},"\u521b\u5efa\u9879\u76ee\uff0c\u4f46\u4e0d\u81ea\u52a8\u5b89\u88c5\u4f9d\u8d56")))),(0,l.kt)("h2",{id:"\u542f\u52a8\u9879\u76ee"},"\u542f\u52a8\u9879\u76ee"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"pnpm dev\n")),(0,l.kt)("h2",{id:"\u7f16\u8f91\u5668\u51c6\u5907"},"\u7f16\u8f91\u5668\u51c6\u5907"),(0,l.kt)("p",null,"\u4ee5VSCode\u4e3e\u4f8b\uff1a"),(0,l.kt)("p",null,"\u56e0\u4e3aESBoot\u5185\u7f6e\u4e86eslint\u3001stylelint\u89c4\u5219\u3002\u6240\u4ee5\u4e00\u5b9a\u8981\u5b89\u88c5\u4ee5\u4e0b\u63d2\u4ef6"),(0,l.kt)("h3",{id:"stylelint"},"Stylelint"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint"},"Stylelint"))),(0,l.kt)("p",null,"stylelint\u4e0b\u8f7d\u4e4b\u540e\u9700\u8981\u914d\u7f6e\u4e00\u4e0b\u80fd\u652f\u6301scss\u89c4\u5219."),(0,l.kt)("p",null,(0,l.kt)("img",{alt:"stylelint-config",src:n(9982).Z,width:"2196",height:"1672"})),(0,l.kt)("p",null,"\u914d\u7f6e\u5b8c\u4e4b\u540e\u68c0\u6d4b\u4e00\u4e0b\uff0c\u627e\u4e00\u4e2ascss\u6587\u4ef6\uff0c\u914d\u7f6e\u4e00\u4e2a0px\uff0c\u67e5\u770b\u4e00\u4e0b\u6548\u679c\u3002"),(0,l.kt)("p",null,(0,l.kt)("img",{alt:"stylelint-error",src:n(8742).Z,width:"1362",height:"808"})),(0,l.kt)("h3",{id:"eslint"},"ESLint"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint"},"ESLint"))),(0,l.kt)("p",null,"\u5b89\u88c5\u5b8c\u4e4b\u540e\u4e0d\u9700\u8981\u989d\u5916\u7684\u914d\u7f6e\uff0c\u76f4\u63a5\u627e\u4e00\u4e2atsx\u6587\u4ef6\uff0c"),(0,l.kt)("h3",{id:"editorconfig"},"EditorConfig"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig"},"EditorConfig"))))}D.isMDXComponent=!0},9982:(e,t,n)=>{n.d(t,{Z:()=>r});const r=n.p+"assets/images/stylelint-config-b63d69b63a7b3a520664ae5755d2377d.png"},8742:(e,t,n)=>{n.d(t,{Z:()=>r});const r=n.p+"assets/images/stylelint-error-c450a8b7336054eed68638b84b3b9c83.png"}}]);