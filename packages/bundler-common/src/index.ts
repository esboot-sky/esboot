export { addReactCompiler } from './babel/add-react-compiler';
export { defaultTemplate } from './constants/default-template';
export { addDefine } from './helpers/add-define';

export { addEntry, type AddEntryCBParams } from './helpers/add-entry';
export {
  createOutputIntent,
  resolveDevtoolIntent,
  resolveExternalsIntent,
} from './helpers/bundler-intent';
export {
  createRuntimeOptimizationIntent,
  shouldEnableCacheIntent,
} from './helpers/cache-intent';
export { createSplitChunksIntent } from './helpers/code-splitting-intent';
export { logDevServer } from './helpers/dev-server';
export {
  createEntryValueIntent,
  createHtmlPageIntent,
  resolveTemplateRootPath,
} from './helpers/entry-intent';
export { mergeFrameworkBundles } from './helpers/framework-bundles';
export { getGlobalScssPathList, isGlobalStyleFile } from './helpers/global-style';
export { injectHtml } from './helpers/inject-html';
export { createResolveIntent } from './helpers/resolve-intent';
export {
  resolveViteFrameworkPlugins,
  resolveViteFrameworkProvider,
  shouldUseReactStyleNamePlugin,
  transformFrameworkBundles,
  type ViteBundlerOptionsLike,
  type ViteFrameworkPluginContext,
  type ViteFrameworkProvider,
} from './helpers/vite-framework-provider';
export { watchOnFileChange } from './helpers/watch-on-file-change';
export { reactStyleNamePlugin, transformStyleName } from './plugins/react-style-name';
export type { TransformStyleNameOptions } from './plugins/react-style-name';
export { addPostcssPluginESBoot } from './postcss/add-plugin-esboot';
export { addPostcssPluginPx2rem } from './postcss/add-plugin-px2rem';

export { addPostcssPluginTailwindcss } from './postcss/add-plugin-tailwindcss';
export { addPostcssPluginFontZoom } from './postcss/add-plugin-font-zoom';
