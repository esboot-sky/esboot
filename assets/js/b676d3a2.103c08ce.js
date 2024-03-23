"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[3003],{6621:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>c,default:()=>h,frontMatter:()=>d,metadata:()=>i,toc:()=>r});var s=n(7458),o=n(7627);const d={sidebar_position:3},c="\u5f00\u53d1",i={id:"esboot/guides/dev",title:"\u5f00\u53d1",description:"\u5165\u53e3\u6587\u4ef6",source:"@site/docs/esboot/guides/dev.md",sourceDirName:"esboot/guides",slug:"/esboot/guides/dev",permalink:"/docs/esboot/guides/dev",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/esboot/guides/dev.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"tutorialSidebar",previous:{title:"\u914d\u7f6e",permalink:"/docs/esboot/guides/config"},next:{title:"Hooks",permalink:"/docs/esboot/guides/hooks"}},l={},r=[{value:"\u5165\u53e3\u6587\u4ef6",id:"\u5165\u53e3\u6587\u4ef6",level:2},{value:"\u5339\u914d\u89c4\u5219",id:"\u5339\u914d\u89c4\u5219",level:3},{value:"\u914d\u7f6e",id:"\u914d\u7f6e",level:3},{value:"title",id:"title",level:4},{value:"template",id:"template",level:4}];function a(e){const t={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",p:"p",pre:"pre",...(0,o.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.h1,{id:"\u5f00\u53d1",children:"\u5f00\u53d1"}),"\n",(0,s.jsx)(t.h2,{id:"\u5165\u53e3\u6587\u4ef6",children:"\u5165\u53e3\u6587\u4ef6"}),"\n",(0,s.jsx)(t.h3,{id:"\u5339\u914d\u89c4\u5219",children:"\u5339\u914d\u89c4\u5219"}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.code,{children:"esboot"}),"\u7684\u89c4\u5219\u662f\u5339\u914d\u6307\u5b9a",(0,s.jsx)(t.code,{children:"platform"})," + ",(0,s.jsx)(t.code,{children:"pageType"}),"\u76ee\u5f55\u4e0b\u7684",(0,s.jsx)(t.code,{children:"*.entry.tsx"}),"\u3002"]}),"\n",(0,s.jsxs)(t.p,{children:["\u4f8b\u5982\u4f60\u7684",(0,s.jsx)(t.code,{children:"env"}),"\u6587\u4ef6\u5982\u4e0b\uff1a"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-sh",children:"ESBOOT_PLATFORM=mobile\nESBOOT_PAGE_TYPE=native\n"})}),"\n",(0,s.jsxs)(t.p,{children:["\u6b64\u65f6\u542f\u52a8",(0,s.jsx)(t.code,{children:"dev/build"}),"\u547d\u4ee4\u4e0b\u7684",(0,s.jsx)(t.code,{children:"content"}),"\u5c31\u662f",(0,s.jsx)(t.code,{children:"src/platforms/mobile/_native"}),"(\u4f60\u4e5f\u53ef\u4ee5\u901a\u8fc7\u8bbe\u7f6e",(0,s.jsx)(t.code,{children:"ESBOOT_CONTENT_PATH"}),"\u548c",(0,s.jsx)(t.code,{children:"ESBOOT_CONTENT_PATTERN"}),"\u81ea\u5b9a\u4e49\u89c4\u5219\uff0c\u66f4\u591a\u53c2\u8003",(0,s.jsx)(t.a,{href:"/docs/esboot/guides/env#esboot_content_path",children:"env"}),")\uff0c\u7136\u540e\u53bb\u5bfb\u627e\u4e0b\u9762\u6240\u6709\u7684",(0,s.jsx)(t.code,{children:"*.entry.tsx"}),"\u5f53\u505a\u5165\u53e3\u3002"]}),"\n",(0,s.jsxs)(t.p,{children:["\u4f8b\u5982\u4f60\u6709\u4e00\u4e2a",(0,s.jsx)(t.code,{children:"home.entry.tsx"}),"\uff0c\u90a3\u4e48\u5728\u6d4f\u89c8\u5668\u4e2d\u7684\u5730\u5740\u5c31\u662f",(0,s.jsx)(t.code,{children:"http://localhost:8001/home.html"}),"(\u57df\u540d\u548c\u7aef\u53e3\u662f\u57fa\u4e8e\u4f60\u7684\u914d\u7f6e\u51b3\u5b9a)."]}),"\n",(0,s.jsx)(t.h3,{id:"\u914d\u7f6e",children:"\u914d\u7f6e"}),"\n",(0,s.jsxs)(t.p,{children:["\u5165\u53e3\u6587\u4ef6\u652f\u6301\u4e00\u4e9b\u914d\u7f6e\uff0c\u5982\u9ed8\u8ba4",(0,s.jsx)(t.code,{children:"title"}),"\u4e4b\u7c7b\u7684\u3002\u5199\u6cd5\u662f\u5728",(0,s.jsx)(t.code,{children:"*.entry.tsx"}),"\u4e2d\u5bfc\u51fa\u4e00\u4e2a\u5bf9\u8c61\uff0c\u5982\uff1a"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-tsx",children:"// \u4f60\u7684React\u4ee3\u7801\n\nexport default {\n  // \u4ee3\u8868\u9875\u9762\u540d\u79f0\u4e3aDEMO\n  title: 'DEMO',\n};\n"})}),"\n",(0,s.jsx)(t.p,{children:"\u4e0b\u9762\u662f\u652f\u6301\u7684\u914d\u7f6e\u6e05\u5355\uff1a"}),"\n",(0,s.jsx)(t.h4,{id:"title",children:"title"}),"\n",(0,s.jsxs)(t.p,{children:["\u9875\u9762\u6807\u9898\uff0c\u9ed8\u8ba4\u4e3a",(0,s.jsx)(t.code,{children:"\u6587\u4ef6\u540d\u79f0 | ESboot APP"}),"\u3002"]}),"\n",(0,s.jsx)(t.h4,{id:"template",children:"template"}),"\n",(0,s.jsxs)(t.p,{children:["\u6a21\u7248html\u5730\u5740\uff0c\u9ed8\u8ba4\u5730\u5740\u662f",(0,s.jsx)(t.code,{children:"config/{platforms}/template/index.html"}),"\u3002"]}),"\n",(0,s.jsxs)(t.p,{children:["\u914d\u7f6e\u4e0d\u662f\u4e00\u4e2a\u5b8c\u6574\u7684\u5730\u5740(\u76ee\u5f55\u662f\u56fa\u5b9a\u6b7b\u7684)\uff0c\u53ea\u9700\u8981\u914d\u7f6e\u9875\u9762\u540d\u79f0\uff0c\u6bd4\u5982",(0,s.jsx)(t.code,{children:"my-tpl"}),"\uff0c\u6b64\u65f6\u7684\u5730\u5740\u5c31\u4f1a\u662f",(0,s.jsx)(t.code,{children:"config/{platforms}/template/my-tpl.html"}),"\u3002"]})]})}function h(e={}){const{wrapper:t}={...(0,o.a)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(a,{...e})}):a(e)}},7627:(e,t,n)=>{n.d(t,{Z:()=>i,a:()=>c});var s=n(2983);const o={},d=s.createContext(o);function c(e){const t=s.useContext(d);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function i(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:c(e.components),s.createElement(d.Provider,{value:t},e.children)}}}]);