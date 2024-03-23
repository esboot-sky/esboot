"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[8610],{3109:(e,t,n)=>{n.d(t,{Z:()=>l});n(2983);var s=n(2095),a=n(2384),i=n(7458);function l(e){const{metadata:t}=e,{previousPage:n,nextPage:l}=t;return(0,i.jsxs)("nav",{className:"pagination-nav","aria-label":(0,s.I)({id:"theme.blog.paginator.navAriaLabel",message:"Blog list page navigation",description:"The ARIA label for the blog pagination"}),children:[n&&(0,i.jsx)(a.Z,{permalink:n,title:(0,i.jsx)(s.Z,{id:"theme.blog.paginator.newerEntries",description:"The label used to navigate to the newer blog posts page (previous page)",children:"Newer Entries"})}),l&&(0,i.jsx)(a.Z,{permalink:l,title:(0,i.jsx)(s.Z,{id:"theme.blog.paginator.olderEntries",description:"The label used to navigate to the older blog posts page (next page)",children:"Older Entries"}),isNext:!0})]})}},7041:(e,t,n)=>{n.d(t,{Z:()=>l});n(2983);var s=n(3364),a=n(9766),i=n(7458);function l(e){let{items:t,component:n=a.Z}=e;return(0,i.jsx)(i.Fragment,{children:t.map((e=>{let{content:t}=e;return(0,i.jsx)(s.n,{content:t,children:(0,i.jsx)(n,{children:(0,i.jsx)(t,{})})},t.metadata.permalink)}))})}},1135:(e,t,n)=>{n.r(t),n.d(t,{default:()=>f});n(2983);var s=n(4517),a=n(2095),i=n(7175),l=n(9331),r=n(3461),o=n(3554),c=n(6738),d=n(3109),g=n(4809),u=n(7041),h=n(6067),p=n(2781),m=n(7458);function x(e){const t=function(){const{selectMessage:e}=(0,i.c)();return t=>e(t,(0,a.I)({id:"theme.blog.post.plurals",description:'Pluralized label for "{count} posts". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',message:"One post|{count} posts"},{count:t}))}();return(0,a.I)({id:"theme.blog.tagTitle",description:"The title of the page for a blog tag",message:'{nPosts} tagged with "{tagName}"'},{nPosts:t(e.count),tagName:e.label})}function j(e){let{tag:t}=e;const n=x(t);return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(l.d,{title:n}),(0,m.jsx)(g.Z,{tag:"blog_tags_posts"})]})}function b(e){let{tag:t,items:n,sidebar:s,listMetadata:i}=e;const l=x(t);return(0,m.jsxs)(c.Z,{sidebar:s,children:[t.unlisted&&(0,m.jsx)(h.Z,{}),(0,m.jsxs)("header",{className:"margin-bottom--xl",children:[(0,m.jsx)(p.Z,{as:"h1",children:l}),(0,m.jsx)(o.Z,{href:t.allTagsPath,children:(0,m.jsx)(a.Z,{id:"theme.tags.tagsPageLink",description:"The label of the link targeting the tag list page",children:"View All Tags"})})]}),(0,m.jsx)(u.Z,{items:n}),(0,m.jsx)(d.Z,{metadata:i})]})}function f(e){return(0,m.jsxs)(l.FG,{className:(0,s.Z)(r.k.wrapper.blogPages,r.k.page.blogTagPostListPage),children:[(0,m.jsx)(j,{...e}),(0,m.jsx)(b,{...e})]})}},6067:(e,t,n)=>{n.d(t,{Z:()=>h});n(2983);var s=n(4517),a=n(2095),i=n(1252),l=n(7458);function r(){return(0,l.jsx)(a.Z,{id:"theme.unlistedContent.title",description:"The unlisted content banner title",children:"Unlisted page"})}function o(){return(0,l.jsx)(a.Z,{id:"theme.unlistedContent.message",description:"The unlisted content banner message",children:"This page is unlisted. Search engines will not index it, and only users having a direct link can access it."})}function c(){return(0,l.jsx)(i.Z,{children:(0,l.jsx)("meta",{name:"robots",content:"noindex, nofollow"})})}var d=n(3461),g=n(5844);function u(e){let{className:t}=e;return(0,l.jsx)(g.Z,{type:"caution",title:(0,l.jsx)(r,{}),className:(0,s.Z)(t,d.k.common.unlistedBanner),children:(0,l.jsx)(o,{})})}function h(e){return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(c,{}),(0,l.jsx)(u,{...e})]})}}}]);