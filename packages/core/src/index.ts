export * from '@@/config/plugin';
export * from '@@/config/types';
export type { CompileTimeConfig } from '@@/config/compile-time-config';
export { registerTypescript } from '@@/services/prepare';
export { default as esbootConfig } from '@@/config';

export { default as defineConfig } from './helpers/define-config';

// compiler
export { addDefine } from '@@/compiler/utils/add-define';
